// server.js
import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";
import helmet from "helmet";
import compression from "compression";
import sirv from "sirv";
import { createServer as createViteServer } from "vite";
import { LRUCache } from "lru-cache";

const isVercel = !!process.env.VERCEL;
const isProduction = process.env.NODE_ENV === "production" || isVercel;
const port = process.env.PORT || 3000;
const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

const config = {
    ssr: {
        cache: {
            max: 1000,
            maxAge: 1000 * 60 * 15,
        },
        timeout: 10000,
        compression: {
            threshold: 1024,
            level: 6,
        },
    },
};

const ssrCache = new LRUCache({
    max: config.ssr.cache.max,
    maxAge: config.ssr.cache.maxAge,
});

const templateHtml = isProduction ? await fs.readFile("./dist/client/index.html", "utf-8") : "";

const app = express();

// --- Security middleware ---
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "connect-src": ["'self'", "ws://localhost:24678", "http://localhost:8000"],
                "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                "img-src": ["'self'", "data:", "blob:", "https://uploadthing-prod-sea1.s3.us-west-2.amazonaws.com", "https://utfs.io"],
            },
        },
    })
);

app.use(compression(config.ssr.compression));

// --- Helpers ---
function getSubdomainFromHost(host) {
    if (!host) return null;
    const parts = host.split(".");
    if (host.includes("localhost")) return parts.length > 1 ? parts[0] : null;
    return parts.length > 2 ? parts[0] : null;
}

function getCacheKey(req) {
    const url = req.originalUrl.replace(base, "");
    const host = req.headers.host || "";
    const subdomain = getSubdomainFromHost(host);
    return `${subdomain || "main"}:${url}`;
}

// --- Vite or static serving ---
let vite;
if (!isProduction && !isVercel) {
    vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
        base,
    });
    app.use(vite.middlewares);
} else {
    app.use(base, sirv("./dist/client", { extensions: [], gzip: true }));
}

app.use("*", async (req, res) => {
    try {
        const cacheKey = getCacheKey(req);
        const url = req.originalUrl.replace(base, "");
        const host = req.headers.host || "";
        const subdomain = getSubdomainFromHost(host);

        // Serve cached SSR (production only)
        if (isProduction) {
            const cached = ssrCache.get(cacheKey);
            if (cached) {
                res.setHeader("x-cache", "HIT");
                return res.send(cached);
            }
        }

        let template;
        let render;

        if (!isProduction && vite) {
            template = await fs.readFile("./index.html", "utf-8");
            template = await vite.transformIndexHtml(url, template);
            render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
        } else {
            template = templateHtml;
            render = (await import("./dist/server/entry-server.js")).render;
        }

        let resolved = false;
        let chunks = [];
        const initialProps = { subdomain };

        const { pipe, abort } = render(
            url,
            {
                onShellError() {
                    if (resolved) return;
                    resolved = true;
                    res.status(500).send("<h1>Something went wrong</h1>");
                },
                onShellReady() {
                    if (resolved) return;
                    resolved = true;

                    res.status(200).set({ "Content-Type": "text/html" });

                    const transformStream = new Transform({
                        transform(chunk, encoding, callback) {
                            chunks.push(chunk);
                            res.write(chunk, encoding);
                            callback();
                        },
                    });

                    const [htmlStart, htmlEnd] = template.split("<!--app-html-->");
                    res.write(htmlStart);

                    transformStream.on("finish", () => {
                        const appHtml = Buffer.concat(chunks).toString();
                        const fullHtml = htmlStart + appHtml + `<script>window.__INITIAL_PROPS__=${JSON.stringify(initialProps)}</script>` + htmlEnd;

                        if (isProduction) ssrCache.set(cacheKey, fullHtml);
                        res.end(fullHtml);
                    });

                    pipe(transformStream);
                },
            },
            subdomain
        );

        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                abort();
                res.status(503).send("SSR timeout");
            }
        }, ABORT_DELAY);
    } catch (err) {
        vite?.ssrFixStacktrace(err);
        console.error("SSR Error:", err);
        res.status(500).end("Internal Server Error");
    }
});

if (!isVercel) {
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
}

// ✅ For Vercel serverless
export default function handler(req, res) {
    return app(req, res);
}
