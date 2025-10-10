import { useState, useEffect } from 'react'
import { useBannersByPlacement } from './use-banners'


export function usePopupBanner() {
  const [showPopup, setShowPopup] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const { banners, hasBanners } = useBannersByPlacement('popup')

  useEffect(() => {
    const popupDismissed = sessionStorage.getItem('popup-banner-dismissed')
    
    if (popupDismissed || dismissed || !hasBanners) {
      return
    }

    const timer = setTimeout(() => {
      setShowPopup(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [hasBanners, dismissed])

  const dismissPopup = () => {
    setShowPopup(false)
    setDismissed(true)
    sessionStorage.setItem('popup-banner-dismissed', 'true')
  }

  return {
    showPopup: showPopup && hasBanners && !dismissed,
    banners,
    dismissPopup
  }
}
