import { usePopupBanner } from '@/hooks/use-popup-banner'
import { PopupBanner } from './banner-display'

/**
 * Component that manages popup banner display across the app
 */
export function PopupBannerManager() {
  const { showPopup, dismissPopup } = usePopupBanner()

  if (!showPopup) {
    return null
  }

  return <PopupBanner onClose={dismissPopup} />
}
