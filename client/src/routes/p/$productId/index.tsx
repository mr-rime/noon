import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/p/$productId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/p/$productId/"!</div>
}
