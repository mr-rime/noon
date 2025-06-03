// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Bench } from 'tinybench';
// import { createCanvas, loadImage } from '@napi-rs/canvas';

// const processedImageCache = new Map<string, string>();

// export async function removeImageBackgroundNode(imageSrc: string, useCache = true): Promise<string> {
//     if (useCache && processedImageCache.has(imageSrc)) {
//         return processedImageCache.get(imageSrc)!;
//     }

//     const bgR = 255, bgG = 255, bgB = 255, threshold = 10;

//     const base64Data = imageSrc.split(',')[1];
//     const buffer = Buffer.from(base64Data, 'base64');

//     const img = await loadImage(buffer);

//     const canvas = createCanvas(img.width, img.height);
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0);

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;

//     for (let i = 0; i < data.length; i += 4) {
//         const r = data[i], g = data[i + 1], b = data[i + 2];
//         if (Math.abs(r - bgR) < threshold &&
//             Math.abs(g - bgG) < threshold &&
//             Math.abs(b - bgB) < threshold) {
//             data[i + 3] = 0;
//         }
//     }

//     ctx.putImageData(imageData, 0, 0);
//     const result = canvas.toDataURL('image/png');

//     if (useCache) {
//         processedImageCache.set(imageSrc, result);
//     }
//     return result;
// }

// global.Image = class {
//     src = '';
//     onload?: () => void;
//     constructor() {
//         setTimeout(() => this.onload?.(), 0);
//     }
// } as any;

// function createTestImage(width: number, height: number): string {
//     const cacheKey = `test-image-${width}x${height}`;
//     if (processedImageCache.has(cacheKey)) {
//         return processedImageCache.get(cacheKey)!;
//     }

//     const canvas = createCanvas(width, height);
//     const ctx = canvas.getContext('2d')!;

//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, 0, width, height);

//     ctx.fillStyle = 'red';
//     ctx.fillRect(width / 4, height / 4, width / 2, height / 2);

//     const result = canvas.toDataURL('image/png');
//     processedImageCache.set(cacheKey, result);
//     return result;
// }



// async function main() {
//     const bench = new Bench({ time: 1000 });

//     const sizes = [
//         { name: 'small', size: 100 },
//         { name: 'medium', size: 500 },
//         { name: 'large', size: 1000 }
//     ];

//     // Pre-generate test images
//     for (const { size } of sizes) {
//         createTestImage(size, size);
//     }

//     // Add both cached and uncached versions
//     for (const { name, size } of sizes) {
//         // Uncached version
//         bench.add(`[UNCACHED] removeImageBackground - ${name} (${size}x${size})`, async () => {
//             await removeImageBackgroundNode(createTestImage(size, size), false);
//         });

//         // Cached version
//         bench.add(`[CACHED] removeImageBackground - ${name} (${size}x${size})`, async () => {
//             await removeImageBackgroundNode(createTestImage(size, size));
//         });
//     }

//     await bench.run();

//     // Get fastest cached and uncached
//     const cachedTasks = bench.tasks.filter(t => t.name.includes('[CACHED]'));
//     const uncachedTasks = bench.tasks.filter(t => t.name.includes('[UNCACHED]'));

//     const fastestCached = cachedTasks.reduce((fastest, task) =>
//         (!fastest || task.result?.throughput.mean > fastest.result?.throughput.mean) ? task : fastest
//     );
//     const fastestUncached = uncachedTasks.reduce((fastest, task) =>
//         (!fastest || task.result?.throughput.mean > fastest.result?.throughput.mean) ? task : fastest
//     );

//     // Format the results exactly as requested
//     console.log(`Fastest Cached: ${fastestCached.name} (${fastestCached.result?.throughput.mean.toFixed(2)} ops/sec)`);
//     console.log(`Fastest Uncached: ${fastestUncached.name} (${fastestUncached.result?.throughput.mean.toFixed(2)} ops/sec)`);

//     // Calculate performance improvement
//     if (fastestCached.result && fastestUncached.result) {
//         const improvement = (fastestCached.result.throughput.mean / fastestUncached.result.throughput.mean - 1) * 100;
//         console.log(`\nCache performance improvement: ${improvement.toFixed(2)}% faster`);
//     }

//     // Optional: Display full results table if needed
//     console.log('\nFull Results:');
//     console.table(bench.tasks.map(({ name, result }) => ({
//         'Task': name,
//         'Ops/sec': result ? Math.round(result.throughput.mean).toLocaleString() : 'N/A',
//         'Avg (ms)': result ? (result.mean * 1000).toFixed(2) : 'N/A'
//     })));
// }

// main().catch(console.error);