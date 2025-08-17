import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";
import helmet from "helmet";
import compression from "compression";
import sirv from "sirv";
import { createServer as createViteServer } from "vite";
import { LRUCache } from "lru-cache";

const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
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

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "connect-src": ["'self'", "ws://localhost:24678", "http://localhost:8000"],
                "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                "img-src": ["'self'", "data:", "http://localhost:8000"],
            },
        },
    })
);

app.use(compression(config.ssr.compression));

export function getSubdomainFromHost(host) {
    if (!host) return null;
    const parts = host.split(".");

    if (host.includes("localhost")) {
        return parts.length > 1 ? parts[0] : null;
    }
    return parts.length > 2 ? parts[0] : null;
}

function getCacheKey(req) {
    const url = req.originalUrl.replace(base, "");
    const host = req.headers.host || "";
    const subdomain = getSubdomainFromHost(host);
    return `${subdomain || "main"}:${url}`;
}

let vite;
if (!isProduction) {
    vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "custom",
        base,
    });
    app.use(vite.middlewares);
} else {
    app.use(base, sirv("./dist/client", { extensions: [], gzip: true }));
}

app.use("*all", async (req, res) => {
    try {
        const cacheKey = getCacheKey(req);
        const url = req.originalUrl.replace(base, "");
        const host = req.headers.host || "";
        const subdomain = getSubdomainFromHost(host);

        // Try cache
        if (isProduction) {
            const cached = ssrCache.get(cacheKey);
            if (cached) {
                res.setHeader("x-cache", "HIT");
                return res.send(cached);
            }
        }

        let template;
        let render;

        if (!isProduction) {
            template = await fs.readFile("./index.html", "utf-8");
            template = await vite.transformIndexHtml(url, template);
            render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
        } else {
            template = templateHtml;
            render = (await import("./dist/server/entry-server.js")).render;
        }

        let didError = false;
        let resolved = false;
        let chunks = [];

        const initialProps = { subdomain };

        const { pipe, abort } = render(
            url,
            {
                onShellError() {
                    if (resolved) return;
                    resolved = true;
                    res.status(500).set({ "Content-Type": "text/html" });
                    res.send("<h1>Something went wrong</h1>");
                },
                onShellReady() {
                    if (resolved) return;
                    resolved = true;

                    res.status(didError ? 500 : 200);
                    res.set({
                        "Content-Type": "text/html",
                        ...(isProduction && !didError ? { "x-cache": "MISS" } : {}),
                    });

                    const transformStream = new Transform({
                        transform(chunk, encoding, callback) {
                            chunks.push(chunk);
                            res.write(chunk, encoding);
                            callback();
                        },
                    });

                    const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

                    res.write(htmlStart);

                    transformStream.on("finish", () => {
                        const appHtml = Buffer.concat(chunks).toString();
                        const fullHtml = htmlStart + appHtml + `<script>window.__INITIAL_PROPS__=${JSON.stringify(initialProps)}</script>` + htmlEnd;

                        if (isProduction && !didError) {
                            ssrCache.set(cacheKey, fullHtml);
                        }

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
                res.status(503).send("Service Unavailable - Rendering timed out");
            }
        }, ABORT_DELAY);
    } catch (e) {
        vite?.ssrFixStacktrace(e);
        console.error("SSR Error:", e.stack);
        res.status(500).end("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
