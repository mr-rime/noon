import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { cn } from '../../../utils/cn'

interface CarouselProps {
    children?: React.ReactNode[]
    itemsPerView?: number | 'auto'
    gap?: number
    autoPlay?: boolean
    autoPlayInterval?: number
    showControls?: boolean
    showDots?: boolean
    loop?: boolean
    className?: string
    controlClassName?: string

    infinityScroll?: boolean
    onLoadMore?: () => void
    hasMore?: boolean
    isLoading?: boolean

    virtualization?: boolean
    containerHeight?: number
    itemHeight?: number
    itemWidth?: number
    gridCols?: number
}

interface VirtualItem {
    index: number
    offset: number
    size: number
    visible: boolean
}

export function InfinityCarousel({
    children = [],
    itemsPerView = 'auto',
    gap = 5,
    autoPlay = false,
    autoPlayInterval = 4000,
    showControls = true,
    showDots = false,
    loop = false,
    className = '',
    controlClassName = '',
    itemWidth: fixedItemWidth,
    infinityScroll = false,
    onLoadMore,
    hasMore = false,
    isLoading = false,
    virtualization = false,
    containerHeight = 400,
    itemHeight = 300,
    gridCols = 1,
}: CarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const sliderRef = useRef<HTMLDivElement>(null)
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [currentTranslate, setCurrentTranslate] = useState(0)
    const [sliderWidth, setSliderWidth] = useState(0)
    const [itemWidth, setItemWidth] = useState(0)
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true)
    const dragVelocity = useRef(0)
    const lastDragPosition = useRef(0)
    const lastDragTime = useRef(0)
    const itemsRef = useRef<HTMLDivElement[]>([])
    const totalWidthRef = useRef(0)
    const dragOffset = useRef(0)
    const autoPlayRef = useRef<NodeJS.Timeout>(null)
    const [scrollOffset, setScrollOffset] = useState(0)
    const scrollTimeoutRef = useRef<NodeJS.Timeout>(null)


    const virtualItems = useMemo(() => {
        if (!virtualization || !children.length) return []

        const items: VirtualItem[] = []
        const itemsPerRow = gridCols

        for (let index = 0; index < children.length; index++) {
            const row = Math.floor(index / itemsPerRow)
            const offset = row * (itemHeight + gap)

            items.push({
                index,
                offset,
                size: itemHeight,
                visible: offset < scrollOffset + containerHeight && offset + itemHeight > scrollOffset
            })
        }

        return items
    }, [virtualization, children.length, gap, scrollOffset, containerHeight, gridCols, itemHeight])

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        if (!virtualization) return

        const scrollTop = e.currentTarget.scrollTop
        setScrollOffset(scrollTop)


        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }


        if (infinityScroll && hasMore && !isLoading) {
            const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
            const threshold = 200

            if (scrollTop + clientHeight >= scrollHeight - threshold) {
                onLoadMore?.()
            }
        }
    }, [virtualization, infinityScroll, hasMore, isLoading, onLoadMore])

    const getMaxTranslate = useCallback(() => {
        return Math.max(totalWidthRef.current - sliderWidth, 0)
    }, [sliderWidth])

    const getClampedTranslate = useCallback(
        (translate: number) => {
            if (loop) return translate
            const maxTranslate = getMaxTranslate()
            return Math.max(-maxTranslate, Math.min(0, translate))
        },
        [loop, getMaxTranslate],
    )

    const smoothScrollTo = useCallback(
        (targetTranslate: number, transition = true) => {
            if (!sliderRef.current) return
            const clampedTranslate = getClampedTranslate(targetTranslate)
            sliderRef.current.style.transition = transition ? 'transform 0.3s ease' : 'none'
            sliderRef.current.style.transform = `translateX(${clampedTranslate}px)`
            setCurrentTranslate(clampedTranslate)
        },
        [getClampedTranslate],
    )

    const getTranslateForIndex = useCallback(
        (index: number) => {
            let translate = 0
            for (let i = 0; i < index; i++) {
                const item = itemsRef.current[i]
                if (item) {
                    translate += (fixedItemWidth || item.offsetWidth) + gap
                }
            }
            return -translate
        },
        [fixedItemWidth, gap],
    )

    const handlePrev = useCallback(() => {
        if (children.length <= 1) return
        let newIndex = currentIndex - 1
        let newTranslate = 0

        if (newIndex < 0) {
            if (loop) {
                newIndex = children.length - 1
                newTranslate = getTranslateForIndex(newIndex)
            } else {
                newIndex = 0
                newTranslate = 0
            }
        } else {
            newTranslate = getTranslateForIndex(newIndex)
        }

        setCurrentIndex(newIndex)
        smoothScrollTo(newTranslate)
    }, [children.length, currentIndex, loop, getTranslateForIndex, smoothScrollTo])

    const handleNext = useCallback(() => {
        if (children.length <= 1) return
        let newIndex = currentIndex + 1
        let newTranslate = 0

        if (newIndex >= children.length) {
            if (loop) {
                newIndex = 0
                newTranslate = 0
            } else {
                newIndex = children.length - 1
                newTranslate = getTranslateForIndex(newIndex)
            }
        } else {
            newTranslate = getTranslateForIndex(newIndex)
        }

        setCurrentIndex(newIndex)
        smoothScrollTo(newTranslate)


        if (infinityScroll && hasMore && !isLoading && newIndex >= children.length - 2) {
            onLoadMore?.()
        }
    }, [children.length, currentIndex, loop, getTranslateForIndex, smoothScrollTo, infinityScroll, hasMore, isLoading, onLoadMore])

    const goToIndex = useCallback(
        (index: number) => {
            if (index < 0 || index >= children.length) return
            const newTranslate = getTranslateForIndex(index)
            setCurrentIndex(index)
            smoothScrollTo(newTranslate)
        },
        [children.length, getTranslateForIndex, smoothScrollTo],
    )

    useEffect(() => {
        if (!containerRef.current || !sliderRef.current) return

        const updateDimensions = () => {
            const containerWidth = containerRef.current?.clientWidth || 0
            setSliderWidth(containerWidth)

            if (fixedItemWidth) {
                setItemWidth(fixedItemWidth)
                totalWidthRef.current = (fixedItemWidth + gap) * children.length - gap
            } else if (itemsPerView === 'auto') {
                let totalWidth = 0
                itemsRef.current.forEach((item, index) => {
                    if (item) {
                        const width = item.offsetWidth
                        totalWidth += width + (index < children.length - 1 ? gap : 0)
                    }
                })
                totalWidthRef.current = totalWidth
            } else {
                const totalGap = gap * (itemsPerView - 1)
                const calculatedWidth = (containerWidth - totalGap) / itemsPerView
                setItemWidth(calculatedWidth)
                totalWidthRef.current = (calculatedWidth + gap) * children.length - gap
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)

        if (autoPlay && children.length > 1 && !isDragging) {
            autoPlayRef.current = setInterval(() => {
                handleNext()
            }, autoPlayInterval)
        }

        return () => {
            window.removeEventListener('resize', updateDimensions)
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current)
                autoPlayRef.current = null
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [itemsPerView, gap, children.length, fixedItemWidth, autoPlay, autoPlayInterval, isDragging, handleNext])

    useEffect(() => {
        if (autoPlay && !autoPlayRef.current) {
            autoPlayRef.current = setInterval(() => {
                handleNext()
            }, autoPlayInterval)
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current)
                autoPlayRef.current = null
            }
        }
    }, [autoPlay, autoPlayInterval, handleNext])

    useEffect(() => {
        const currentTimeout = scrollTimeoutRef.current
        return () => {
            if (currentTimeout) {
                clearTimeout(currentTimeout)
            }
        }
    }, [])

    const handleDragStart = (clientX: number) => {
        if (children.length <= 1) return
        setIsDragging(true)
        setStartX(clientX)
        lastDragPosition.current = clientX
        lastDragTime.current = Date.now()
        dragVelocity.current = 0
        dragOffset.current = currentTranslate
        setIsTransitionEnabled(false)
        if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }

    const handleDragMove = (clientX: number) => {
        if (!isDragging || !sliderRef.current || children.length <= 1) return
        const now = Date.now()
        const deltaTime = now - lastDragTime.current
        if (deltaTime > 0) {
            const deltaX = clientX - lastDragPosition.current
            dragVelocity.current = deltaX / deltaTime
        }
        lastDragPosition.current = clientX
        lastDragTime.current = now
        const moveX = clientX - startX
        const newTranslate = dragOffset.current + moveX
        let boundedTranslate = newTranslate
        if (!loop) {
            const maxTranslate = getMaxTranslate()
            if (newTranslate > 0) boundedTranslate = newTranslate * 0.5
            else if (newTranslate < -maxTranslate) {
                boundedTranslate = -maxTranslate + (newTranslate + maxTranslate) * 0.5
            }
        }
        sliderRef.current.style.transform = `translateX(${boundedTranslate}px)`
        setCurrentTranslate(boundedTranslate)
    }

    const handleDragEnd = () => {
        if (!isDragging || children.length <= 1) {
            setIsDragging(false)
            setIsTransitionEnabled(true)
            return
        }
        setIsDragging(false)
        setIsTransitionEnabled(true)
        const momentumThreshold = 0.3
        const momentumMultiplier = 50
        let targetTranslate = currentTranslate
        if (Math.abs(dragVelocity.current) > momentumThreshold) {
            targetTranslate += dragVelocity.current * momentumMultiplier
        }
        let closestIndex = 0
        let smallestDistance = Number.POSITIVE_INFINITY
        for (let i = 0; i < children.length; i++) {
            const itemTranslate = getTranslateForIndex(i)
            const distance = Math.abs(targetTranslate - itemTranslate)
            if (distance < smallestDistance) {
                smallestDistance = distance
                closestIndex = i
            }
        }
        if (loop) {
            const firstItemTranslate = 0
            const lastItemTranslate = getTranslateForIndex(children.length - 1)
            closestIndex =
                Math.abs(targetTranslate - firstItemTranslate) < Math.abs(targetTranslate - lastItemTranslate)
                    ? 0
                    : children.length - 1
        }
        const finalTranslate = getTranslateForIndex(closestIndex)
        setCurrentIndex(closestIndex)
        smoothScrollTo(finalTranslate)


        if (infinityScroll && hasMore && !isLoading && closestIndex >= children.length - 2) {
            onLoadMore?.()
        }

        if (autoPlay && !autoPlayRef.current) {
            autoPlayRef.current = setInterval(() => handleNext(), autoPlayInterval)
        }
    }

    const stopPropagation = (e: React.TouchEvent | React.MouseEvent) => e.stopPropagation()

    const handleTouchStart = (e: React.TouchEvent) => {
        stopPropagation(e)
        handleDragStart(e.touches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        stopPropagation(e)
        handleDragMove(e.touches[0].clientX)
    }

    const handleTouchEnd = (e: React.TouchEvent) => {
        stopPropagation(e)
        handleDragEnd()
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        stopPropagation(e)
        handleDragStart(e.clientX)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        stopPropagation(e)
        if (isDragging) handleDragMove(e.clientX)
    }

    const handleMouseUp = (e: React.MouseEvent) => {
        stopPropagation(e)
        handleDragEnd()
    }

    const handleMouseLeave = (e: React.MouseEvent) => {
        stopPropagation(e)
        handleDragEnd()
    }

    const addToItemsRef = (el: HTMLDivElement | null, index: number) => {
        if (el) itemsRef.current[index] = el
    }

    const showPrevControl = showControls && (loop || currentIndex > 0)
    const showNextControl = showControls && (loop || currentIndex < children.length - 1 || (infinityScroll && hasMore))


    const renderVirtualizedItems = () => {
        if (!virtualization) return children

        const actualItemWidth = fixedItemWidth || itemWidth || 200
        const itemsPerRow = gridCols


        const rows: number[][] = []
        for (let i = 0; i < virtualItems.length; i += itemsPerRow) {
            rows.push(virtualItems.slice(i, i + itemsPerRow).map(item => item.index))
        }

        return rows.map((rowIndices, rowIndex) => {
            const shouldRenderRow = rowIndices.some(index => {
                const virtualItem = virtualItems.find(item => item.index === index)
                return virtualItem?.visible
            })

            if (!shouldRenderRow) return null

            return (
                <div
                    key={`row-${rowIndex}`}
                    className="flex flex-row"
                    style={{
                        gap: `${gap}px`,
                        marginBottom: rowIndex < rows.length - 1 ? `${gap}px` : '0',
                        position: 'absolute',
                        top: `${rowIndex * (itemHeight + gap)}px`,
                        left: 0,
                        right: 0,
                    }}
                >
                    {rowIndices.map((index) => {
                        const virtualItem = virtualItems.find(item => item.index === index)
                        if (!virtualItem || !virtualItem.visible) return null

                        const child = children[index]
                        if (!child) return null

                        return (
                            <div
                                key={index}
                                ref={(el) => addToItemsRef(el, index)}
                                className="flex-shrink-0"
                                style={{
                                    width: `${actualItemWidth}px`,
                                    height: `${itemHeight}px`,
                                }}
                            >
                                {child}
                            </div>
                        )
                    })}
                </div>
            )
        })
    }

    if (virtualization) {
        return (
            <div
                className={cn('relative w-full overflow-hidden', className)}
                ref={containerRef}
                style={{ height: containerHeight }}
            >
                <div
                    ref={scrollContainerRef}
                    className="h-full overflow-y-auto"
                    onScroll={handleScroll}
                    style={{ scrollbarWidth: 'thin' }}
                >
                    <div
                        className="relative"
                        style={{
                            width: '100%',
                            height: virtualItems.length > 0
                                ? Math.ceil(virtualItems.length / gridCols) * (itemHeight + gap) - gap
                                : 0,
                        }}
                    >
                        {renderVirtualizedItems()}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={cn('relative w-full overflow-hidden', className)} ref={containerRef}>
            <div
                ref={sliderRef}
                className="flex touch-pan-y touch-pinch-zoom will-change-transform"
                style={{
                    gap: `${gap}px`,
                    transform: `translateX(${currentTranslate}px)`,
                    transition: isTransitionEnabled ? 'transform 0.3s ease' : 'none',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        ref={(el) => addToItemsRef(el, index)}
                        className={cn('flex-shrink-0', itemsPerView === 'auto' && !fixedItemWidth ? 'w-auto' : '')}
                        style={{
                            width: fixedItemWidth ? `${fixedItemWidth}px` : itemsPerView === 'auto' ? 'auto' : `${itemWidth}px`,
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
                        '-translate-y-1/2 absolute top-1/2 left-2 z-10 rounded-full bg-white/80 p-2 text-black transition hover:bg-white',
                        controlClassName,
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
                        '-translate-y-1/2 absolute top-1/2 right-2 z-10 rounded-full bg-white/80 p-2 text-black transition hover:bg-white',
                        controlClassName,
                    )}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            {showDots && children.length > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                    {children.map((_, index) => (
                        <button
                            key={index}
                            className={`h-3 w-3 cursor-pointer rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-black' : 'bg-gray-300'}`}
                            onClick={() => goToIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {infinityScroll && isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Loading more...
                    </div>
                </div>
            )}
        </div>
    )
}
