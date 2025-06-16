import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../../utils/cn";

interface ElementSliderProps {
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

export function ElementSlider({
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
}: ElementSliderProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [sliderWidth, setSliderWidth] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
    const animationRef = useRef<number | null>(null);
    const dragVelocity = useRef(0);
    const lastDragPosition = useRef(0);
    const lastDragTime = useRef(0);
    const itemsRef = useRef<HTMLDivElement[]>([]);
    const totalWidthRef = useRef(0);
    const dragOffset = useRef(0);

    useEffect(() => {
        if (!containerRef.current || !sliderRef.current) return;

        const updateDimensions = () => {
            const containerWidth = containerRef.current?.clientWidth || 0;
            setSliderWidth(containerWidth);

            if (fixedItemWidth) {
                setItemWidth(fixedItemWidth);
                totalWidthRef.current = (fixedItemWidth + gap) * children.length - gap;
            } else if (itemsPerView === 'auto') {
                setItemWidth(0);
                totalWidthRef.current = itemsRef.current.reduce(
                    (sum, item) => sum + (item?.offsetWidth || 0) + gap,
                    -gap
                );
            } else {
                const totalGap = gap * (itemsPerView - 1);
                const calculatedWidth = (containerWidth - totalGap) / itemsPerView;
                setItemWidth(calculatedWidth);
                totalWidthRef.current = (calculatedWidth + gap) * children.length - gap;
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [itemsPerView, gap, children.length, fixedItemWidth]);

    useEffect(() => {
        if (!autoPlay || children.length <= 1 || isDragging) return;

        const interval = setInterval(() => {
            handleNext();
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, currentIndex, children.length, isDragging]);

    const getSlideStep = () => {
        if (fixedItemWidth) return fixedItemWidth + gap;
        if (itemsPerView === 'auto') {
            return itemsRef.current[currentIndex]?.offsetWidth + gap || 0;
        }
        return sliderWidth / itemsPerView + gap;
    };

    const getVisibleWidth = () => {
        if (fixedItemWidth) return fixedItemWidth + gap;
        if (itemsPerView === 'auto') {
            const item = itemsRef.current[currentIndex];
            if (!item) return 0;
            return item.offsetWidth + gap;
        }
        return sliderWidth / itemsPerView + gap;
    };

    const getMaxTranslate = () => {
        return -(totalWidthRef.current - sliderWidth);
    };

    const smoothScrollTo = (targetTranslate: number, transition = true) => {
        if (!sliderRef.current) return;

        const clampedTranslate = getClampedTranslate(targetTranslate);

        if (transition) {
            sliderRef.current.style.transition = 'transform 0.3s ease';
        } else {
            sliderRef.current.style.transition = 'none';
        }

        sliderRef.current.style.transform = `translateX(${clampedTranslate}px)`;
        setCurrentTranslate(clampedTranslate);
    };

    const getClampedTranslate = (translate: number) => {
        if (loop) return translate;

        const maxTranslate = getMaxTranslate();
        return Math.max(maxTranslate, Math.min(0, translate));
    };

    const handlePrev = useCallback(() => {
        if (children.length <= 1) return;

        let newTranslate = currentTranslate + getVisibleWidth();

        if (!loop && newTranslate > 0) {
            newTranslate = 0;
        } else if (loop && newTranslate > 0) {
            newTranslate = getMaxTranslate();
        }

        let newIndex = currentIndex;
        let accumulatedWidth = 0;

        for (let i = 0; i < children.length; i++) {
            const item = itemsRef.current[i];
            if (!item) continue;

            accumulatedWidth += item.offsetWidth + gap;

            if (-newTranslate <= accumulatedWidth) {
                newIndex = i;
                break;
            }
        }

        setCurrentIndex(newIndex);
        smoothScrollTo(newTranslate);
    }, [currentIndex, currentTranslate, children.length, loop, sliderWidth, gap]);

    const handleNext = useCallback(() => {
        if (children.length <= 1) return;

        let newTranslate = currentTranslate - getVisibleWidth();
        const maxTranslate = getMaxTranslate();

        if (!loop && newTranslate < maxTranslate) {
            newTranslate = maxTranslate;
        } else if (loop && newTranslate < maxTranslate) {
            newTranslate = 0;
        }

        let newIndex = currentIndex;
        let accumulatedWidth = 0;

        for (let i = 0; i < children.length; i++) {
            const item = itemsRef.current[i];
            if (!item) continue;

            accumulatedWidth += item.offsetWidth + gap;

            if (-newTranslate <= accumulatedWidth) {
                newIndex = i;
                break;
            }
        }

        setCurrentIndex(newIndex);
        smoothScrollTo(newTranslate);
    }, [currentIndex, currentTranslate, children.length, loop, sliderWidth, gap]);

    const goToIndex = useCallback((index: number) => {
        if (index < 0 || index >= children.length) return;

        let translate = 0;
        for (let i = 0; i < index; i++) {
            const item = itemsRef.current[i];
            if (item) {
                translate += item.offsetWidth + gap;
            }
        }

        setCurrentIndex(index);
        smoothScrollTo(-translate);
    }, [children.length]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (children.length <= 1) return;
        setIsDragging(true);
        const clientX = e.touches[0].clientX;
        setStartX(clientX);
        lastDragPosition.current = clientX;
        lastDragTime.current = Date.now();
        dragVelocity.current = 0;
        dragOffset.current = currentTranslate;
        setIsTransitionEnabled(false);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (children.length <= 1) return;
        setIsDragging(true);
        const clientX = e.clientX;
        setStartX(clientX);
        lastDragPosition.current = clientX;
        lastDragTime.current = Date.now();
        dragVelocity.current = 0;
        dragOffset.current = currentTranslate;
        setIsTransitionEnabled(false);
    };

    const handleMove = (clientX: number) => {
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

        let boundedTranslate = newTranslate;
        if (!loop) {
            const maxTranslate = getMaxTranslate();

            if (newTranslate > 0) {
                boundedTranslate = newTranslate * 0.5;
            } else if (newTranslate < maxTranslate) {
                boundedTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.5;
            }
        }

        sliderRef.current.style.transform = `translateX(${boundedTranslate}px)`;
        setCurrentTranslate(boundedTranslate);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        handleMove(e.clientX);
    };

    const handleEnd = () => {
        if (!isDragging || !sliderRef.current || children.length <= 1) {
            setIsDragging(false);
            setIsTransitionEnabled(true);
            return;
        }

        setIsDragging(false);
        setIsTransitionEnabled(true);

        const momentumThreshold = 0.3;
        const momentumMultiplier = 50;

        let targetTranslate = currentTranslate;

        // Apply momentum if velocity is high enough
        if (Math.abs(dragVelocity.current) > momentumThreshold) {
            targetTranslate += dragVelocity.current * momentumMultiplier;
        }

        // Calculate the closest slide
        const slideStep = getSlideStep();
        const targetIndex = Math.round(-targetTranslate / slideStep);

        let finalIndex = targetIndex;
        if (loop) {
            if (targetIndex < 0) {
                finalIndex = children.length - 1;
            } else if (targetIndex >= children.length) {
                finalIndex = 0;
            }
        } else {
            finalIndex = Math.max(0, Math.min(children.length - 1, targetIndex));
        }

        // Calculate final position
        let finalTranslate = -finalIndex * slideStep;

        // If not looping, clamp the final position
        if (!loop) {
            const maxTranslate = getMaxTranslate();
            finalTranslate = Math.max(maxTranslate, Math.min(0, finalTranslate));
        }

        setCurrentIndex(finalIndex);
        smoothScrollTo(finalTranslate);
    };

    const addToItemsRef = (el: HTMLDivElement | null, index: number) => {
        if (el && !itemsRef.current.includes(el)) {
            itemsRef.current[index] = el;
        }
    };

    return (
        <div
            className={cn("relative w-full overflow-hidden", className)}
            ref={containerRef}
        >
            <div
                ref={sliderRef}
                className="flex will-change-transform snap-x snap-mandatory scroll-smooth"
                style={{
                    gap: `${gap}px`,
                    transform: `translateX(${currentTranslate}px)`,
                    transition: isTransitionEnabled ? 'transform 0.3s ease' : 'none',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
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

            {showControls && children.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        disabled={!loop && currentIndex === 0}
                        className={cn(
                            "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-black p-2 rounded-full hover:bg-white transition disabled:opacity-50",
                            controlClassName
                        )}
                        aria-label="Previous element"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!loop && currentIndex >= children.length - 1}
                        className={cn(
                            "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 text-black p-2 rounded-full hover:bg-white transition disabled:opacity-50",
                            controlClassName
                        )}
                        aria-label="Next element"
                    >
                        <ChevronRight size={24} />
                    </button>
                </>
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