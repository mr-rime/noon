import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const realImages = [
    "/media/imgs/slideable-img1.avif",
    "/media/imgs/slideable-img2.avif",
    "/media/imgs/slideable-img3.avif",
];

const images = [
    realImages[realImages.length - 1],
    ...realImages,
    realImages[0],
];

export function SlideableImages() {
    const IMAGE_WIDTH = 1500;
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const touchStartX = useRef(0);
    const touchDelta = useRef(0);

    const [index, setIndex] = useState(1);
    const logicalIndex = useRef(1);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(-IMAGE_WIDTH);
    const [isAnimating, setIsAnimating] = useState(false);

    const setTranslate = useCallback((value: number, smooth: boolean) => {
        if (containerRef.current) {
            containerRef.current.style.transition = smooth ? "transform 0.3s ease" : "none";
            containerRef.current.style.transform = `translateX(${value}px)`;
        }
    }, []);

    useEffect(() => {
        setTranslate(-IMAGE_WIDTH, false);
        currentTranslate.current = -IMAGE_WIDTH;

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [setTranslate]);

    const goToSlide = useCallback((newIndex: number) => {
        if (isAnimating) return;

        setIsAnimating(true);
        setIndex(newIndex);
        logicalIndex.current = newIndex;

        const newTranslate = -newIndex * IMAGE_WIDTH;
        currentTranslate.current = newTranslate;
        setTranslate(newTranslate, true);

        animationRef.current = requestAnimationFrame(() => {
            setTimeout(() => {
                if (newIndex === 0) {
                    logicalIndex.current = realImages.length;
                    currentTranslate.current = -realImages.length * IMAGE_WIDTH;
                    setTranslate(currentTranslate.current, false);
                    setIndex(realImages.length);
                } else if (newIndex === images.length - 1) {
                    logicalIndex.current = 1;
                    currentTranslate.current = -IMAGE_WIDTH;
                    setTranslate(currentTranslate.current, false);
                    setIndex(1);
                }
                setIsAnimating(false);
            }, 300);
        });
    }, [isAnimating, setTranslate]);

    const goNext = useCallback(() => {
        if (!isAnimating && !isDragging.current) goToSlide(logicalIndex.current + 1);
    }, [isAnimating, goToSlide]);

    const goPrev = useCallback(() => {
        if (!isAnimating && !isDragging.current) goToSlide(logicalIndex.current - 1);
    }, [isAnimating, goToSlide]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        isDragging.current = true;
        if (containerRef.current) {
            containerRef.current.style.transition = "none";
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging.current) return;
        touchDelta.current = e.touches[0].clientX - touchStartX.current;
        const nextTranslate = currentTranslate.current + touchDelta.current;
        setTranslate(nextTranslate, false);
    }, [setTranslate]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging.current) return;
        isDragging.current = false;

        let nextIndex = logicalIndex.current;
        if (touchDelta.current < -IMAGE_WIDTH / 3) {
            nextIndex++;
        } else if (touchDelta.current > IMAGE_WIDTH / 3) {
            nextIndex--;
        }

        goToSlide(Math.max(0, Math.min(images.length - 1, nextIndex)));
        touchDelta.current = 0;
    }, [goToSlide]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.clientX;
        if (containerRef.current) {
            containerRef.current.style.transition = "none";
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const delta = e.clientX - startX.current;
        const nextTranslate = currentTranslate.current + delta;
        setTranslate(nextTranslate, false);
    }, [setTranslate]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const delta = e.clientX - startX.current;

        let nextIndex = logicalIndex.current;
        if (delta < -IMAGE_WIDTH / 3) {
            nextIndex++;
        } else if (delta > IMAGE_WIDTH / 3) {
            nextIndex--;
        }

        goToSlide(Math.max(0, Math.min(images.length - 1, nextIndex)));
    }, [goToSlide]);

    const handleMouseLeave = useCallback(() => {
        if (isDragging.current) {
            isDragging.current = false;
            goToSlide(logicalIndex.current);
        }
    }, [goToSlide]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAnimating && !isDragging.current) {
                goNext();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isAnimating, goNext]);

    return (
        <div className="relative w-[1500px] h-[340px]">
            <button
                onClick={goPrev}
                disabled={isAnimating || isDragging.current}
                className="flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition disabled:opacity-50 cursor-pointer"
                aria-label="Previous image"
            >
                <ChevronLeft size={45} />
            </button>
            <button
                onClick={goNext}
                disabled={isAnimating || isDragging.current}
                className="flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition disabled:opacity-50 cursor-pointer"
                aria-label="Next image"
            >
                <ChevronRight size={45} />
            </button>

            <div
                className="w-full h-[300px] overflow-hidden cursor-grab select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    ref={containerRef}
                    className="flex will-change-transform"
                    style={{ width: `${images.length * IMAGE_WIDTH}px` }}
                >
                    {images.map((src, i) => (
                        <img
                            key={i}
                            src={src}
                            loading={i <= 1 ? "eager" : "lazy"}
                            draggable={false}
                            className="w-[1500px] h-[300px] object-cover pointer-events-none"
                            alt={`Slide ${i}`}
                        />
                    ))}
                </div>
            </div>

            <div className="flex justify-center items-center gap-3 mt-3 h-[50px] w-full absolute bottom-[5px] -translate-x-1/2 -translate-y-1/2 left-1/2">
                {realImages.map((_, i) => (
                    <button
                        key={i}
                        className={`w-[22px] h-[3px] transition-colors duration-300 cursor-pointer ${index === i + 1 ? "bg-[#FEEE00]" : "bg-[#E2E5F1]"
                            }`}
                        onClick={() => goToSlide(i + 1)}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}