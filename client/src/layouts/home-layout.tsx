import { Header } from '@/shared/components/header'
import { Outlet } from '@tanstack/react-router'
import { PopupBannerManager } from '@/features/landing/components/banners/popup-banner-manager'
import Footer from '@/features/landing/components/footer'

export function HomeLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />

      <PopupBannerManager />
    </>
  )
}
