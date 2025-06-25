import { createLazyFileRoute } from '@tanstack/react-router'
import { Orders } from '../../../../../../components/profile-page/components/orders'

export const Route = createLazyFileRoute('/(main)/_homeLayout/(profile)/_profileLayout/orders/')({
  component: Orders,
})