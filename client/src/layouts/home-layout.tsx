import { Header } from '@/components/header'
import { Outlet } from '@tanstack/react-router'
import { FooterBanner } from '@/components/banners/banner-display'
import { PopupBannerManager } from '@/components/banners/popup-banner-manager'

export function HomeLayout() {
  return (
    <>
      <Header />
      <Outlet />
      {/* Footer Banner */}
      <div className="mt-16 mb-8 px-4">
        <FooterBanner className="max-w-6xl mx-auto" />
      </div>
      {/* Popup Banner Manager */}
      <PopupBannerManager />
    </>
  )
}
