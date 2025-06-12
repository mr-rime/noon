import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(profile)/_profileLayout/security-settings/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(profile)/_profileLayout/security-settings/"!</div>
}
