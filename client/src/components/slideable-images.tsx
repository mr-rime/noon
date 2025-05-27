import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const realImages = [
    "/media/imgs/slideable-img1.avif",
    "/media/imgs/slideable-img2.avif",
];

const images = [
    realImages[realImages.length - 1],
    ...realImages,
    realImages[0],
];

export function SlideableImages() {
    const IMAGE_WIDTH = 1000;
    const containerRef = useRef<HTMLDivElement>(null);

    const [index, setIndex] = useState(1); // React state index (user facing)
    const logicalIndex = useRef(1);       // Ref to track the actual index including clones

    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);
    const prevTranslate = useRef(-IMAGE_WIDTH);

    // On mount, set initial translate to first real image
    useEffect(() => {
        setTranslate(-IMAGE_WIDTH, false);
    }, []);

    const setTranslate = (value: number, smooth: boolean) => {
        if (containerRef.current) {
            containerRef.current.style.transition = smooth ? "transform 0.3s ease" : "none";
            containerRef.current.style.transform = `translateX(${value}px)`;
        }
    };

    const goToSlide = (newIndex: number) => {
        logicalIndex.current = newIndex;
        const newTranslate = -newIndex * IMAGE_WIDTH;

        setTranslate(newTranslate, true);
        prevTranslate.current = newTranslate;

        // Update React state only with "real" indexes (1 or 2)
        // For clones (0 or last), set state to corresponding real index so UI matches
        if (newIndex === 0) {
            setIndex(realImages.length);
        } else if (newIndex === images.length - 1) {
            setIndex(1);
        } else {
            setIndex(newIndex);
        }
    };

    const goNext = () => {
        const nextIndex = logicalIndex.current + 1;
        if (nextIndex >= images.length) {
            // If we're at the end, wrap around to the first real slide
            goToSlide(1);
        } else {
            goToSlide(nextIndex);
        }
    };

    const goPrev = () => {
        const prevIndex = logicalIndex.current - 1;
        if (prevIndex < 0) {
            // If we're at the beginning, wrap around to the last real slide
            goToSlide(realImages.length);
        } else {
            goToSlide(prevIndex);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.clientX;
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const delta = e.clientX - startX.current;
        currentTranslate.current = prevTranslate.current + delta;
        setTranslate(currentTranslate.current, false);
    };

    const handleMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const movedBy = currentTranslate.current - prevTranslate.current;

        let newIndex = logicalIndex.current;

        if (movedBy < -IMAGE_WIDTH / 3) {
            newIndex = logicalIndex.current + 1;
        } else if (movedBy > IMAGE_WIDTH / 3) {
            newIndex = logicalIndex.current - 1;
        }

        // Clamp the index within [0..images.length-1]
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= images.length) newIndex = images.length - 1;

        goToSlide(newIndex);
    };

    const handleMouseLeave = () => {
        if (isDragging.current) {
            handleMouseUp();
        }
    };

    // When transition ends, jump instantly if on clones without changing React state
    const handleTransitionEnd = () => {
        if (logicalIndex.current === 0) {
            // Jump instantly to last real slide (without animation or state update)
            logicalIndex.current = realImages.length;
            prevTranslate.current = -logicalIndex.current * IMAGE_WIDTH;
            setTranslate(prevTranslate.current, false);
        } else if (logicalIndex.current === images.length - 1) {
            // Jump instantly to first real slide
            logicalIndex.current = 1;
            prevTranslate.current = -IMAGE_WIDTH;
            setTranslate(prevTranslate.current, false);
        }
    };

    return (
        <div className="relative w-[1000px] h-[300px]">
            <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition"
                aria-label="Previous image"
            >
                <ChevronLeft />
            </button>
            <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition"
                aria-label="Next image"
            >
                <ChevronRight />
            </button>

            <div
                className="w-full h-full overflow-hidden cursor-grab select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={containerRef}
                    className="flex"
                    onTransitionEnd={handleTransitionEnd}
                    style={{ width: `${images.length * IMAGE_WIDTH}px` }}
                >
                    {images.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            draggable={false}
                            className="w-[1000px] h-[300px] object-cover pointer-events-none"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}