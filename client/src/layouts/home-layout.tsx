import { Header } from '@/components/header'
import { Outlet } from '@tanstack/react-router'
import { PopupBannerManager } from '@/components/banners/popup-banner-manager'

export function HomeLayout() {
  return (
    <>
      <Header />
      <Outlet />

      <PopupBannerManager />
    </>
  )
}
