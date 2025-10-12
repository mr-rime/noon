/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { product_icons } from '@/components/product/constants/icons'
import { cn } from '@/utils/cn'
import { useIsMobile } from '@/hooks/use-mobile'
import { Image } from '@unpic/react'

type DotsThemeType = 'theme1' | 'theme2' | 'theme3'

interface ImageSliderProps {
  images: string[]
  mobileImages?: string[]
  height?: number | string
  autoPlay?: boolean
  autoPlayInterval?: number
  showControls?: boolean
  lazyImage?: boolean
  showDots?: boolean
  scaleOnHover?: boolean
  showProductControls?: boolean
  showProductDots?: boolean
  dotsTheme?: DotsThemeType
  disableDragDesktop?: boolean
  disableDragMobile?: boolean
}

export function ImageSlider({
  images,
  mobileImages,
  height = 'fit-content',
  autoPlay = true,
  autoPlayInterval = 4000,
  showControls = true,
  showDots = true,
  lazyImage = false,
  showProductControls = false,
  scaleOnHover = false,
  disableDragDesktop = false,
  disableDragMobile = false,
  dotsTheme = 'theme1',
}: ImageSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const touchStartX = useRef(0)
  const touchDelta = useRef(0)
  const isMobile = useIsMobile()

  const [index, setIndex] = useState(1)
  const logicalIndex = useRef(1)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const currentTranslate = useRef(0)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  const [isAnimating, setIsAnimating] = useState(false)
  const [loadedImages, setLoadedImages] = useState<boolean[]>([])

  const isDragDisabled = isMobile ? disableDragMobile : disableDragDesktop

  const displayImages = useMemo(() => (isMobile ? mobileImages : images) ?? [], [isMobile, mobileImages, images])
  const extendedImages =
    displayImages.length > 1
      ? [displayImages[displayImages.length - 1], ...displayImages, displayImages[0]]
      : displayImages

  const getSliderWidth = () => containerRef.current?.parentElement?.clientWidth || 0

  const setTranslate = useCallback((value: number, smooth: boolean) => {
    if (containerRef.current) {
      containerRef.current.style.transition = smooth ? 'transform 0.3s ease' : 'none'
      containerRef.current.style.transform = `translateX(${value}px)`
    }
  }, [])

  const stopEventPropagation = (e: React.SyntheticEvent) => {
    e.stopPropagation()
  }

  const handleImageLoad = (i: number) => {
    setLoadedImages(prev => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }

  useEffect(() => {
    if (displayImages.length > 1) {
      const sliderWidth = getSliderWidth()
      currentTranslate.current = -sliderWidth
      setTranslate(currentTranslate.current, false)
    }
  }, [displayImages.length, setTranslate])

  const goToSlide = useCallback(
    (newIndex: number) => {
      if (isAnimating || displayImages.length <= 1) return

      setIsAnimating(true)
      setIndex(newIndex)
      logicalIndex.current = newIndex

      const sliderWidth = getSliderWidth()
      const newTranslate = -newIndex * sliderWidth
      currentTranslate.current = newTranslate
      setTranslate(newTranslate, true)

      animationRef.current = requestAnimationFrame(() => {
        setTimeout(() => {
          if (newIndex === 0) {
            logicalIndex.current = displayImages.length
            currentTranslate.current = -displayImages.length * sliderWidth
            setTranslate(currentTranslate.current, false)
            setIndex(displayImages.length)
          } else if (newIndex === extendedImages.length - 1) {
            logicalIndex.current = 1
            currentTranslate.current = -sliderWidth
            setTranslate(currentTranslate.current, false)
            setIndex(1)
          }
          setIsAnimating(false)
        }, 300)
      })
    },
    [isAnimating, setTranslate, displayImages.length, extendedImages.length],
  )

  const goNext = useCallback(
    (e: React.MouseEvent | null) => {
      if (e) {
        e.preventDefault()
        stopEventPropagation(e)
      }
      if (!isAnimating && !isDragging.current && displayImages.length > 1) {
        goToSlide(logicalIndex.current + 1)
      }
    },
    [isAnimating, goToSlide, displayImages.length],
  )

  const startAutoplay = useCallback(() => {
    if (!autoPlay || displayImages.length <= 1) return
    stopAutoplay()
    autoplayRef.current = setInterval(() => {
      if (!isAnimating && !isDragging.current) {
        goToSlide(logicalIndex.current + 1)
      }
    }, autoPlayInterval)
  }, [autoPlay, autoPlayInterval, isAnimating, displayImages.length, goToSlide])

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }, [])

  useEffect(() => {
    setLoadedImages(new Array(extendedImages.length).fill(false))
  }, [extendedImages.length])

  useEffect(() => {
    startAutoplay()
    return stopAutoplay
  }, [startAutoplay, stopAutoplay])

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      stopEventPropagation(e)
      e.preventDefault()
      if (!isAnimating && !isDragging.current && displayImages.length > 1) {
        goToSlide(logicalIndex.current - 1)
      }
    },
    [isAnimating, goToSlide, displayImages.length],
  )

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (displayImages.length <= 1 || isDragDisabled) return
      stopEventPropagation(e)
      stopAutoplay()
      touchStartX.current = e.touches[0].clientX
      isDragging.current = true
      if (containerRef.current) {
        containerRef.current.style.transition = 'none'
      }
    },
    [displayImages.length, isDragDisabled],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || displayImages.length <= 1 || isDragDisabled) return
      stopEventPropagation(e)
      touchDelta.current = e.touches[0].clientX - touchStartX.current
      const nextTranslate = currentTranslate.current + touchDelta.current
      setTranslate(nextTranslate, false)
    },
    [setTranslate, displayImages.length, isDragDisabled],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || displayImages.length <= 1 || isDragDisabled) return
      stopEventPropagation(e)
      isDragging.current = false

      const sliderWidth = getSliderWidth()
      let nextIndex = logicalIndex.current
      if (touchDelta.current < -sliderWidth / 3) {
        nextIndex++
      } else if (touchDelta.current > sliderWidth / 3) {
        nextIndex--
      }

      goToSlide(Math.max(0, Math.min(extendedImages.length - 1, nextIndex)))
      touchDelta.current = 0
      startAutoplay()
    },
    [goToSlide, displayImages.length, extendedImages.length, isDragDisabled],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (displayImages.length <= 1 || isDragDisabled) return
      stopEventPropagation(e)
      stopAutoplay()
      isDragging.current = true
      startX.current = e.clientX
      if (containerRef.current) {
        containerRef.current.style.transition = 'none'
      }
    },
    [displayImages.length, isDragDisabled],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || displayImages.length <= 1 || isDragDisabled) return
      stopEventPropagation(e)
      const delta = e.clientX - startX.current
      const nextTranslate = currentTranslate.current + delta
      setTranslate(nextTranslate, false)
    },
    [setTranslate, displayImages.length, isDragDisabled],
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || displayImages.length <= 1 || isDragDisabled) return
      stopEventPropagation(e)
      isDragging.current = false

      const delta = e.clientX - startX.current
      const sliderWidth = getSliderWidth()

      let nextIndex = logicalIndex.current
      if (delta < -sliderWidth / 3) {
        nextIndex++
      } else if (delta > sliderWidth / 3) {
        nextIndex--
      }

      goToSlide(Math.max(0, Math.min(extendedImages.length - 1, nextIndex)))
      startAutoplay()
    },
    [goToSlide, displayImages.length, extendedImages.length, isDragDisabled],
  )

  const handleMouseLeave = useCallback(() => {
    if (isDragging.current && displayImages.length > 1 && !isDragDisabled) {
      isDragging.current = false
      goToSlide(logicalIndex.current)
    }
  }, [goToSlide, displayImages.length, isDragDisabled])

  const dotsRender = () => {
    switch (dotsTheme) {
      case 'theme1':
        return (
          <div className="-translate-x-1/2 absolute bottom-4 left-1/2 flex items-center justify-center gap-3">
            {displayImages.map((_, i) => (
              <button
                key={i}
                className={`h-[2px] w-[22px] cursor-pointer transition-colors duration-300 ${index === i + 1 ? 'bg-[#FEEE00]' : 'bg-[#E2E5F1]'}`}
                onClick={() => goToSlide(i + 1)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )
      case 'theme2':
        return (
          <div
            className={cn(
              '* 4)] -translate-x-1/2 absolute bottom-2 left-1/2 flex min-h-[calc(4px w-fit items-center justify-center gap-[4px] rounded-full bg-[#ECEDF2] px-2 py-[5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100',
              isMobile && 'opacity-100',
            )}>
            {displayImages.map((_, i) => (
              <button
                key={i}
                className={cn(
                  `h-[4px] w-[4px] cursor-pointer rounded-full transition-all duration-300 `,
                  index === i + 1 ? 'w-[12px] bg-[#34353a]' : 'bg-[#b6b6b9]',
                )}
                onClick={(e) => {
                  e.preventDefault()
                  goToSlide(i + 1)
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )
      case 'theme3':
        return (
          <div className="* 4)] -translate-x-1/2 visible absolute bottom-5 left-1/2 flex min-h-[calc(4px w-fit items-center justify-center gap-[4px] rounded-full bg-transparent px-2 py-[5px] opacity-[1] transition-opacity duration-300">
            {displayImages.map((_, i) => (
              <button
                key={i}
                className={cn(
                  `h-[6px] w-[6px] cursor-pointer rounded-full border border-[#404553] transition-all ease-in-out`,
                  index === i + 1 ? 'bg-[#34353a]' : 'bg-transparent',
                )}
                onClick={(e) => {
                  e.preventDefault()
                  goToSlide(i + 1)
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="group h-full w-full touch-none">
      <div
        className={cn(
          'relative select-none ',
          isMobile ? 'h-fit w-full rounded-[12px]' : `w-full rounded-[12px] overflow-hidden h-[${height}px]`,
        )}
        onMouseEnter={() => (isDragging.current = false)}
        onMouseLeave={handleMouseLeave}
        aria-label="Image slider">
        {!isMobile && showControls && displayImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              disabled={isAnimating || isDragging.current}
              className="-translate-y-1/2 absolute top-1/2 left-4 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 disabled:opacity-50"
              aria-label="Previous image">
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goNext}
              disabled={isAnimating || isDragging.current}
              className="-translate-y-1/2 absolute top-1/2 right-4 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/50 p-2 text-white transition hover:bg-black/75 disabled:opacity-50"
              aria-label="Next image">
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {!isMobile && showProductControls && displayImages.length > 1 && (
          <div className="">
            <button
              onClick={goPrev}
              disabled={isAnimating || isDragging.current}
              className="group-hover:-left-1.5 -left-[31px] -translate-y-1/2 absolute top-1/2 z-10 flex cursor-pointer items-center justify-center rounded-[5px] bg-black/50 px-1 py-2 text-white transition-all hover:bg-black/75 disabled:opacity-50"
              aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              disabled={isAnimating || isDragging.current}
              className="group-hover:-right-1.5 -right-[31px] -translate-y-1/2 absolute top-1/2 z-10 flex cursor-pointer items-center justify-center rounded-[5px] bg-black/50 px-1 py-2 text-white transition-all hover:bg-black/75 disabled:opacity-50"
              aria-label="Next image">
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}>
          <div
            ref={containerRef}
            className={cn('flex h-full will-change-transform', !showProductControls && isMobile && 'gap-3')}
            style={{
              width: `${showProductControls || !isMobile ? extendedImages.length * 100 : 490}%`,
            }}>
            {extendedImages.map((src, i) => {
              const isLoaded = loadedImages[i]

              return (
                <div
                  key={i}
                  className={cn(
                    `relative w-full flex-shrink-0 overflow-hidden bg-[#F6F6F7] transition-transform `,
                    isMobile ? 'h-full' : '',
                  )}
                  style={{
                    width: `${100 / extendedImages.length}%`,
                    height
                  }}>

                  {!isLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 " />
                  )}

                  <div
                    className={cn(
                      showProductControls
                        ? 'flex w-full items-center justify-center bg-[#F6F6F7]'
                        : 'h-full w-full overflow-hidden',
                      scaleOnHover && 'duration-300 ease-in-out hover:scale-[1.1]',
                    )}>
                    <Image
                      src={
                        showProductControls
                          ? ((i === 0 ? images[displayImages.length - 1] : images[(i - 1) % displayImages.length]) ??
                            product_icons.noonIcon)
                          : src
                      }
                      layout="constrained"
                      width={490}
                      height={330}
                      loading={lazyImage ? 'lazy' : 'eager'}
                      draggable={false}
                      className={cn(
                        'pointer-events-none h-full w-full object-cover mix-blend-multiply transition-opacity duration-500',
                        isLoaded ? 'opacity-100' : 'opacity-0',
                      )}
                      alt={`Slide ${i}`}
                      onLoad={() => handleImageLoad(i)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {showDots && displayImages.length > 1 && dotsRender()}
      </div>
    </div>
  )
}
