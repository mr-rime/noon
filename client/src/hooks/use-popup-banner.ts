import { useState, useEffect } from 'react'
import { useBannersByPlacement } from './use-banners'

/**
 * Hook to manage popup banner display logic
 */
export function usePopupBanner() {
  const [showPopup, setShowPopup] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { banners, hasBanners } = useBannersByPlacement('popup')

  useEffect(() => {
    // Check if popup was already dismissed in this session
    const popupDismissed = sessionStorage.getItem('popup-banner-dismissed')
    
    if (popupDismissed || dismissed || !hasBanners) {
      return
    }

    // Show popup after a delay (e.g., 3 seconds after page load)
    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [hasBanners, dismissed])

  const dismissPopup = () => {
    setShowPopup(false)
    setDismissed(true)
    // Remember dismissal for this session
    sessionStorage.setItem('popup-banner-dismissed', 'true')
  }

  return {
    showPopup: showPopup && hasBanners && !dismissed,
    banners,
    dismissPopup
  }
}
