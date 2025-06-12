import { createFileRoute } from '@tanstack/react-router'
import { TrackingDetails } from '../../../../../../../components/profile-page/components/tracking-details'

export const Route = createFileRoute(
  '/(profile)/_profileLayout/orders/track/order/$orderId/',
)({
  component: TrackingDetails,
})
