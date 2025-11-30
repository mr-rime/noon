import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { type Banner } from '@/shared/types/banner'

interface BannerCarouselProps {
    banners: Banner[]
    autoPlay?: boolean
    autoPlayInterval?: number
    showControls?: boolean
    showDots?: boolean
    onBannerClick?: (banner: Banner) => void
}

export function BannerCarousel({
    banners,
    autoPlay = true,
    autoPlayInterval = 5000,
    showControls = true,
    showDots = true,
    onBannerClick
}: BannerCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (!autoPlay || banners.length <= 1) return

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
        }, autoPlayInterval)

        return () => clearInterval(interval)
    }, [autoPlay, autoPlayInterval, banners.length])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
        )
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
    }

    if (banners.length === 0) return null

    const currentBanner = banners[currentIndex]
    const hasImages = currentBanner.image_url || currentBanner.mobile_image_url
    const hasBothImages = currentBanner.image_url && currentBanner.mobile_image_url

    return (
        <div className="relative w-full group">
            {/* Banner Image */}
            <div className="relative w-full h-[350px] overflow-hidden rounded-xl">
                {hasImages ? (
                    hasBothImages ? (
                        <picture>
                            <source
                                media="(max-width: 767px)"
                                srcSet={currentBanner.mobile_image_url}
                            />
                            <img
                                src={currentBanner.image_url}
                                alt={currentBanner.name}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => onBannerClick?.(currentBanner)}
                            />
                        </picture>
                    ) : (
                        <img
                            src={currentBanner.mobile_image_url || currentBanner.image_url}
                            alt={currentBanner.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => onBannerClick?.(currentBanner)}
                        />
                    )
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
                        <div className="text-center p-8">
                            {currentBanner.name && <h2 className="text-3xl font-bold mb-2">{currentBanner.name}</h2>}
                            {currentBanner.description && <p className="text-lg">{currentBanner.description}</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* Previous/Next Controls */}
            {showControls && banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label="Previous banner"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label="Next banner"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Dots Navigation */}
            {showDots && banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex
                                    ? 'bg-white w-8'
                                    : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Banner Info Overlay (optional) */}
            {(currentBanner.name || currentBanner.description) && hasImages && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                    {currentBanner.name && <h3 className="text-2xl font-bold mb-1">{currentBanner.name}</h3>}
                    {currentBanner.description && <p className="text-sm opacity-90">{currentBanner.description}</p>}
                </div>
            )}
        </div>
    )
}
