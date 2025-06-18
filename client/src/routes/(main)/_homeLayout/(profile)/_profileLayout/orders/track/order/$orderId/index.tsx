import { createFileRoute } from '@tanstack/react-router'
import { TrackingDetails } from '../../../../../../../../../components/profile-page/components/tracking-details'

export const Route = createFileRoute(
  '/(main)/_homeLayout/(profile)/_profileLayout/orders/track/order/$orderId/',
)({
  component: TrackingDetails,
})
