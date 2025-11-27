import { Header } from '@/components/header'
import { Outlet } from '@tanstack/react-router'
import { PopupBannerManager } from '@/components/banners/popup-banner-manager'
import Footer from '@/pages/landing/components/footer'

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
