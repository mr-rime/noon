import { createFileRoute } from '@tanstack/react-router'
import { Orders } from '../../../../components/profile-page/components/orders'

export const Route = createFileRoute('/(profile)/_profileLayout/orders/')({
  component: Orders,
})