import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(profile)/_profileLayout/orders/$orderId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(profile)/_profileLayout/orders/$orderId/"!</div>
}
