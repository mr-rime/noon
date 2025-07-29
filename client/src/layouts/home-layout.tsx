import { Header } from '@/components/header'
import { Outlet } from '@tanstack/react-router'

export function HomeLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
