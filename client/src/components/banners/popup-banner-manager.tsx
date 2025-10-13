import { usePopupBanner } from '@/hooks/use-popup-banner'
import { PopupBanner } from './banner-display'

export function PopupBannerManager() {
  const { showPopup, dismissPopup } = usePopupBanner()

  if (!showPopup) {
    return null
  }

  return <PopupBanner onClose={dismissPopup} />
}
