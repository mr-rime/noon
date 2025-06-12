import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(profile)/_profileLayout/payments/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(profile)/_profileLayout/payments/"!</div>
}
