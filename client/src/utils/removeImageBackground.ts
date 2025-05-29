const processedImageCache = new Map<string, string>();

export async function removeImageBackground(imageSrc: string): Promise<string> {
    if (processedImageCache.has(imageSrc)) {
        return processedImageCache.get(imageSrc)!;
    }

    const bgR = 255, bgG = 255, bgB = 255, threshold = 10;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    await new Promise<void>((resolve) => {
        img.onload = () => resolve();
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (Math.abs(r - bgR) < threshold && Math.abs(g - bgG) < threshold && Math.abs(b - bgB) < threshold) {
            data[i + 3] = 0;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    const result = canvas.toDataURL("image/png");

    processedImageCache.set(imageSrc, result);
    return result;
}