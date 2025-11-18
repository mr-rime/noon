import { useQuery } from '@apollo/client'
import { Link } from '@tanstack/react-router'
import { ExternalLink, X } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { GET_ACTIVE_BANNERS_BY_PLACEMENT } from '../../graphql/banner-display'
import { type Banner } from '../../types/banner'
import { useBannerAnalytics } from '../../hooks/use-banner-analytics'

interface BannerDisplayProps {
  placement: string
  className?: string
  showCloseButton?: boolean
  onClose?: () => void
}

export function BannerDisplay({ placement, className = '', showCloseButton = false, onClose }: BannerDisplayProps) {
  const [dismissed, setDismissed] = useState(false)
  const { trackBannerView, trackBannerClick, trackBannerDismiss } = useBannerAnalytics()

  const { data, loading, error } = useQuery(GET_ACTIVE_BANNERS_BY_PLACEMENT, {
    variables: { placement },
    errorPolicy: 'ignore'
  })

  const banners: Banner[] = useMemo(() => data?.getActiveBannersByPlacement || [], [data?.getActiveBannersByPlacement])

  useEffect(() => {
    if (banners.length > 0) {
      banners.forEach(banner => trackBannerView(banner))
    }
  }, [banners, trackBannerView])

  if (dismissed || loading || error || !banners.length) {
    return null
  }

  const handleDismiss = (banner?: Banner) => {
    setDismissed(true)
    if (banner) {
      trackBannerDismiss(banner)
    }
    onClose?.()
  }

  const handleBannerClick = (banner: Banner) => {
    trackBannerClick(banner)
  }

  return (
    <div className={`banner-container ${className}`}>
      {banners.map((banner) => (
        <div key={banner.id} className="relative group">
          {showCloseButton && (
            <button
              onClick={() => handleDismiss(banner)}
              className="absolute top-2 right-2 z-10 p-1 bg-black/50 text-white rounded-full opacity-0  transition-opacity duration-200 hover:bg-black/70"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {banner.target_url ? (
            <Link
              to={banner.target_url}
              onClick={() => handleBannerClick(banner)}
              className="block relative overflow-hidden transition-transform duration-200  focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <BannerContent banner={banner} />
            </Link>
          ) : (
            <div className="relative overflow-hidden ">
              <BannerContent banner={banner} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function BannerContent({ banner }: { banner: Banner }) {
  return (
    <>
      {banner.image_url ? (
        <div className="relative w-full">
          <img
            src={banner.image_url}
            alt={banner.name}
            className="w-full h-[200px] object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />

          {(banner.name || banner.description) && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          )}

          {(banner.name || banner.description) && (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              {banner.description && (
                <p className="text-sm opacity-90">{banner.description}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
          {banner.name && (
            <h3 className="text-xl font-bold mb-2">{banner.name}</h3>
          )}
          {banner.description && (
            <p className="text-sm opacity-90 mb-3">{banner.description}</p>
          )}
          {banner.target_url && (
            <div className="flex items-center text-sm font-medium">
              <span>Learn more</span>
              <ExternalLink className="ml-1 h-4 w-4" />
            </div>
          )}
        </div>
      )}
    </>
  )
}


export function HeroBanner({ className = '' }: { className?: string }) {
  return (
    <BannerDisplay
      placement="home_hero"
      className={`hero-banner ${className}`}
    />
  )
}

export function SecondaryBanner({ className = '' }: { className?: string }) {
  return (
    <BannerDisplay
      placement="home_secondary"
      className={`secondary-banner ${className}`}
    />
  )
}

export function SidebarBanner({ className = '' }: { className?: string }) {
  return (
    <BannerDisplay
      placement="product_sidebar"
      className={`sidebar-banner ${className}`}
    />
  )
}

export function FooterBanner({ className = '' }: { className?: string }) {
  return (
    <BannerDisplay
      placement="footer_banner"
      className={`footer-banner ${className}`}
    />
  )
}

export function PopupBanner({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="max-w-2xl w-full">
        <BannerDisplay
          placement="popup"
          className="popup-banner"
          showCloseButton={true}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

export function MobileBanner({ className = '' }: { className?: string }) {
  return (
    <div className="block md:hidden">
      <BannerDisplay
        placement="mobile_home"
        className={`mobile-banner ${className}`}
      />
    </div>
  )
}
