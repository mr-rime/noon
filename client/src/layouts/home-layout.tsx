import { Outlet } from '@tanstack/react-router'
import { Header } from '../components/header'

export function HomeLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
