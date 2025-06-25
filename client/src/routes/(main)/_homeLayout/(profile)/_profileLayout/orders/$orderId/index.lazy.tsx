import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/(main)/_homeLayout/(profile)/_profileLayout/orders/$orderId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(profile)/_profileLayout/orders/$orderId/"!</div>
}
