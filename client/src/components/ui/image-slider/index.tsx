import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageSliderProps {
    images: string[];
    width?: number | string;
    height?: number | string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showControls?: boolean;
    showDots?: boolean;
    dotColor?: string;
    activeDotColor?: string;
}

export function ImageSlider({
    images,
    width = "100%",
    height = "fit-content",
    autoPlay = true,
    autoPlayInterval = 4000,
    showControls = true,
    showDots = true,
    dotColor = "#E2E5F1",
    activeDotColor = "#FEEE00",
}: ImageSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number | null>(null);
    const touchStartX = useRef(0);
    const touchDelta = useRef(0);

    const [index, setIndex] = useState(1);
    const logicalIndex = useRef(1);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentTranslate = useRef(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const extendedImages = images.length > 1 ? [
        images[images.length - 1],
        ...images,
        images[0]
    ] : images;

    const getSliderWidth = () => containerRef.current?.parentElement?.clientWidth || 0;

    const setTranslate = useCallback((value: number, smooth: boolean) => {
        if (containerRef.current) {
            containerRef.current.style.transition = smooth ? "transform 0.3s ease" : "none";
            containerRef.current.style.transform = `translateX(${value}px)`;
        }
    }, []);

    useEffect(() => {
        if (images.length > 1) {
            const sliderWidth = getSliderWidth();
            currentTranslate.current = -sliderWidth;
            setTranslate(currentTranslate.current, false);
        }
    }, [images.length, setTranslate]);

    const goToSlide = useCallback((newIndex: number) => {
        if (isAnimating || images.length <= 1) return;

        setIsAnimating(true);
        setIndex(newIndex);
        logicalIndex.current = newIndex;

        const sliderWidth = getSliderWidth();
        const newTranslate = -newIndex * sliderWidth;
        currentTranslate.current = newTranslate;
        setTranslate(newTranslate, true);

        animationRef.current = requestAnimationFrame(() => {
            setTimeout(() => {
                if (newIndex === 0) {
                    logicalIndex.current = images.length;
                    currentTranslate.current = -images.length * sliderWidth;
                    setTranslate(currentTranslate.current, false);
                    setIndex(images.length);
                } else if (newIndex === extendedImages.length - 1) {
                    logicalIndex.current = 1;
                    currentTranslate.current = -sliderWidth;
                    setTranslate(currentTranslate.current, false);
                    setIndex(1);
                }
                setIsAnimating(false);
            }, 300);
        });
    }, [isAnimating, setTranslate, images.length, extendedImages.length]);

    const goNext = useCallback(() => {
        if (!isAnimating && !isDragging.current && images.length > 1) {
            goToSlide(logicalIndex.current + 1);
        }
    }, [isAnimating, goToSlide, images.length]);

    const goPrev = useCallback(() => {
        if (!isAnimating && !isDragging.current && images.length > 1) {
            goToSlide(logicalIndex.current - 1);
        }
    }, [isAnimating, goToSlide, images.length]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (images.length <= 1) return;
        touchStartX.current = e.touches[0].clientX;
        isDragging.current = true;
        if (containerRef.current) {
            containerRef.current.style.transition = "none";
        }
    }, [images.length]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging.current || images.length <= 1) return;
        touchDelta.current = e.touches[0].clientX - touchStartX.current;
        const nextTranslate = currentTranslate.current + touchDelta.current;
        setTranslate(nextTranslate, false);
    }, [setTranslate, images.length]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging.current || images.length <= 1) return;
        isDragging.current = false;

        const sliderWidth = getSliderWidth();
        let nextIndex = logicalIndex.current;
        if (touchDelta.current < -sliderWidth / 3) {
            nextIndex++;
        } else if (touchDelta.current > sliderWidth / 3) {
            nextIndex--;
        }

        goToSlide(Math.max(0, Math.min(extendedImages.length - 1, nextIndex)));
        touchDelta.current = 0;
    }, [goToSlide, images.length, extendedImages.length]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (images.length <= 1) return;
        isDragging.current = true;
        startX.current = e.clientX;
        if (containerRef.current) {
            containerRef.current.style.transition = "none";
        }
    }, [images.length]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current || images.length <= 1) return;
        const delta = e.clientX - startX.current;
        const nextTranslate = currentTranslate.current + delta;
        setTranslate(nextTranslate, false);
    }, [setTranslate, images.length]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current || images.length <= 1) return;
        isDragging.current = false;

        const delta = e.clientX - startX.current;
        const sliderWidth = getSliderWidth();

        let nextIndex = logicalIndex.current;
        if (delta < -sliderWidth / 3) {
            nextIndex++;
        } else if (delta > sliderWidth / 3) {
            nextIndex--;
        }

        goToSlide(Math.max(0, Math.min(extendedImages.length - 1, nextIndex)));
    }, [goToSlide, images.length, extendedImages.length]);

    const handleMouseLeave = useCallback(() => {
        if (isDragging.current && images.length > 1) {
            isDragging.current = false;
            goToSlide(logicalIndex.current);
        }
    }, [goToSlide, images.length]);

    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        const interval = setInterval(() => {
            if (!isAnimating && !isDragging.current) {
                goNext();
            }
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, isAnimating, goNext, images.length]);

    return (
        <div
            className="relative overflow-hidden select-none"
            style={{ width, height }}
            onMouseEnter={() => isDragging.current = false}
            onMouseLeave={handleMouseLeave}
        >
            {showControls && images.length > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        disabled={isAnimating || isDragging.current}
                        className="flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition disabled:opacity-50 cursor-pointer"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={goNext}
                        disabled={isAnimating || isDragging.current}
                        className="flex items-center justify-center absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition disabled:opacity-50 cursor-pointer"
                        aria-label="Next image"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            <div
                className="w-full h-full overflow-hidden cursor-grab select-none"
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
                    className="flex will-change-transform h-full"
                    style={{ width: `${extendedImages.length * 100}%` }}
                >
                    {extendedImages.map((src, i) => (
                        <div
                            key={i}
                            className="w-full h-full flex-shrink-0"
                            style={{ width: `${100 / extendedImages.length}%` }}
                        >
                            <img
                                src={src}
                                loading={i <= 1 ? "eager" : "lazy"}
                                draggable={false}
                                className="w-full h-full object-cover pointer-events-none"
                                alt={`Slide ${i}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {showDots && images.length > 1 && (
                <div className="flex justify-center items-center gap-3 absolute bottom-4 left-1/2 -translate-x-1/2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            className={`w-[12px] h-[8px] transition-all duration-300 cursor-pointer rounded-full ${index === i + 1 ? "bg-[#FEEE00]" : "bg-[#E2E5F1]"}`}
                            style={{
                                width: index === i + 1 ? "24px" : "12px",
                                backgroundColor: index === i + 1 ? activeDotColor : dotColor,
                            }}
                            onClick={() => goToSlide(i + 1)}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}