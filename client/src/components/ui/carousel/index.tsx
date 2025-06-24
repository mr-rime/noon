import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../utils/cn";

interface CarouselProps {
    children?: React.ReactNode[];
    itemsPerView?: number | 'auto';
    gap?: number;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    showControls?: boolean;
    showDots?: boolean;
    loop?: boolean;
    className?: string;
    controlClassName?: string;
    itemWidth?: number;
}

export function Carousel({
    children = [],
    itemsPerView = 'auto',
    gap = 16,
    autoPlay = false,
    autoPlayInterval = 4000,
    showControls = true,
    showDots = false,
    loop = false,
    className = '',
    controlClassName = '',
    itemWidth: fixedItemWidth,
}: CarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
    const dragVelocity = useRef(0);
    const lastDragPosition = useRef(0);
    const lastDragTime = useRef(0);
    const itemsRef = useRef<HTMLDivElement[]>([]);
    const totalWidthRef = useRef(0);
    const dragOffset = useRef(0);
    const autoPlayRef = useRef<NodeJS.Timeout>(null);

    useEffect(() => {
        if (!containerRef.current || !sliderRef.current) return;

        const updateDimensions = () => {
            const containerWidth = containerRef.current?.clientWidth || 0;
            setSliderWidth(containerWidth);

            if (fixedItemWidth) {
                setItemWidth(fixedItemWidth);
                totalWidthRef.current = (fixedItemWidth + gap) * children.length - gap;
            } else if (itemsPerView === 'auto') {
                let totalWidth = 0;
                itemsRef.current.forEach((item, index) => {
                    if (item) {
                        const width = item.offsetWidth;
                        totalWidth += width + (index < children.length - 1 ? gap : 0);
                    }
                });
                totalWidthRef.current = totalWidth;
            } else {
                const totalGap = gap * (itemsPerView - 1);
                const calculatedWidth = (containerWidth - totalGap) / itemsPerView;
                setItemWidth(calculatedWidth);
                totalWidthRef.current = (calculatedWidth + gap) * children.length - gap;
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        if (autoPlay && children.length > 1 && !isDragging) {
            autoPlayRef.current = setInterval(() => {
                handleNext();
            }, autoPlayInterval);
        }

        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, [itemsPerView, gap, children.length, fixedItemWidth, autoPlay, autoPlayInterval, isDragging]);

    const getMaxTranslate = useCallback(() => {
        return Math.max(totalWidthRef.current - sliderWidth, 0);
    }, [sliderWidth]);

    const getClampedTranslate = useCallback((translate: number) => {
        if (loop) return translate;
        const maxTranslate = getMaxTranslate();
        return Math.max(-maxTranslate, Math.min(0, translate));
    }, [loop, getMaxTranslate]);

    const smoothScrollTo = useCallback((targetTranslate: number, transition = true) => {
        if (!sliderRef.current) return;

        const clampedTranslate = getClampedTranslate(targetTranslate);

        sliderRef.current.style.transition = transition ? 'transform 0.3s ease' : 'none';
        sliderRef.current.style.transform = `translateX(${clampedTranslate}px)`;
        setCurrentTranslate(clampedTranslate);
    }, [getClampedTranslate]);


    const getTranslateForIndex = useCallback((index: number) => {
        let translate = 0;
        for (let i = 0; i < index; i++) {
            const item = itemsRef.current[i];
            if (item) {
                translate += (fixedItemWidth || item.offsetWidth) + gap;
            }
        }
        return -translate;
    }, [fixedItemWidth, gap]);

    const handlePrev = useCallback(() => {
        if (children.length <= 1) return;

        let newIndex = currentIndex - 1;
        let newTranslate = 0;

        if (newIndex < 0) {
            if (loop) {
                newIndex = children.length - 1;
                newTranslate = getTranslateForIndex(newIndex);
            } else {
                newIndex = 0;
                newTranslate = 0;
            }
        } else {
            newTranslate = getTranslateForIndex(newIndex);
        }

        setCurrentIndex(newIndex);
        smoothScrollTo(newTranslate);
    }, [children.length, currentIndex, loop, getTranslateForIndex, smoothScrollTo]);

    const handleNext = useCallback(() => {
        if (children.length <= 1) return;

        let newIndex = currentIndex + 1;
        let newTranslate = 0;

        if (newIndex >= children.length) {
            if (loop) {
                newIndex = 0;
                newTranslate = 0;
            } else {
                newIndex = children.length - 1;
                newTranslate = getTranslateForIndex(newIndex);
            }
        } else {
            newTranslate = getTranslateForIndex(newIndex);
        }

        setCurrentIndex(newIndex);
        smoothScrollTo(newTranslate);
    }, [children.length, currentIndex, loop, getTranslateForIndex, smoothScrollTo]);

    const goToIndex = useCallback((index: number) => {
        if (index < 0 || index >= children.length) return;

        const newTranslate = getTranslateForIndex(index);
        setCurrentIndex(index);
        smoothScrollTo(newTranslate);
    }, [children.length, getTranslateForIndex, smoothScrollTo]);

    const handleDragStart = (clientX: number) => {
        if (children.length <= 1) return;
        setIsDragging(true);
        setStartX(clientX);
        lastDragPosition.current = clientX;
        lastDragTime.current = Date.now();
        dragVelocity.current = 0;
        dragOffset.current = currentTranslate;
        setIsTransitionEnabled(false);

        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
    };

    const handleDragMove = (clientX: number) => {
        if (!isDragging || !sliderRef.current || children.length <= 1) return;

        const now = Date.now();
        const deltaTime = now - lastDragTime.current;

        if (deltaTime > 0) {
            const deltaX = clientX - lastDragPosition.current;
            dragVelocity.current = deltaX / deltaTime;
        }

        lastDragPosition.current = clientX;
        lastDragTime.current = now;

        const moveX = clientX - startX;
        const newTranslate = dragOffset.current + moveX;

        // Apply rubber band effect if not looping
        let boundedTranslate = newTranslate;
        if (!loop) {
            const maxTranslate = getMaxTranslate();

            if (newTranslate > 0) {
                boundedTranslate = newTranslate * 0.5;
            } else if (newTranslate < -maxTranslate) {
                boundedTranslate = -maxTranslate + (newTranslate + maxTranslate) * 0.5;
            }
        }

        sliderRef.current.style.transform = `translateX(${boundedTranslate}px)`;
        setCurrentTranslate(boundedTranslate);
    };

    const handleDragEnd = () => {
        if (!isDragging || children.length <= 1) {
            setIsDragging(false);
            setIsTransitionEnabled(true);
            return;
        }

        setIsDragging(false);
        setIsTransitionEnabled(true);

        const momentumThreshold = 0.3;
        const momentumMultiplier = 50;
        let targetTranslate = currentTranslate;

        if (Math.abs(dragVelocity.current) > momentumThreshold) {
            targetTranslate += dragVelocity.current * momentumMultiplier;
        }

        let closestIndex = 0;
        let smallestDistance = Infinity;

        for (let i = 0; i < children.length; i++) {
            const itemTranslate = getTranslateForIndex(i);
            const distance = Math.abs(targetTranslate - itemTranslate);

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestIndex = i;
            }
        }

        if (loop) {
            const firstItemTranslate = 0;
            const lastItemTranslate = getTranslateForIndex(children.length - 1);

            if (Math.abs(targetTranslate - firstItemTranslate) < Math.abs(targetTranslate - lastItemTranslate)) {
                closestIndex = 0;
            } else {
                closestIndex = children.length - 1;
            }
        }

        const finalTranslate = getTranslateForIndex(closestIndex);
        setCurrentIndex(closestIndex);
        smoothScrollTo(finalTranslate);

        if (autoPlay && !autoPlayRef.current) {
            autoPlayRef.current = setInterval(() => {
                handleNext();
            }, autoPlayInterval);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
    const handleTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
    const handleMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
    const handleMouseMove = (e: React.MouseEvent) => isDragging && handleDragMove(e.clientX);

    const addToItemsRef = (el: HTMLDivElement | null, index: number) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current[index] = el;
        }
    };

    const showPrevControl = showControls && (loop || currentIndex > 0);
    const showNextControl = showControls && (loop || currentIndex < children.length - 1);

    return (
        <div className={cn("relative w-full overflow-hidden", className)} ref={containerRef}>
            <div
                ref={sliderRef}
                className="flex will-change-transform touch-pan-y touch-pinch-zoom"
                style={{
                    gap: `${gap}px`,
                    transform: `translateX(${currentTranslate}px)`,
                    transition: isTransitionEnabled ? 'transform 0.3s ease' : 'none',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        ref={(el) => addToItemsRef(el, index)}
                        className={cn(
                            "flex-shrink-0",
                            itemsPerView === 'auto' && !fixedItemWidth ? 'w-auto' : ''
                        )}
                        style={{
                            width: fixedItemWidth
                                ? `${fixedItemWidth}px`
                                : itemsPerView === 'auto'
                                    ? 'auto'
                                    : `${itemWidth}px`,
                        }}
                    >
                        {child}
                    </div>
                ))}
            </div>

            {showPrevControl && (
                <button
                    onClick={handlePrev}
                    className={cn(
                        "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-black p-2 rounded-full hover:bg-white transition",
                        controlClassName
                    )}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
            )}

            {showNextControl && (
                <button
                    onClick={handleNext}
                    className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-black p-2 rounded-full hover:bg-white transition",
                        controlClassName
                    )}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            {showDots && children.length > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                    {children.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-colors duration-300 cursor-pointer ${currentIndex === index ? "bg-black" : "bg-gray-300"
                                }`}
                            onClick={() => goToIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}