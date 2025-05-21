import { createFileRoute } from '@tanstack/react-router'
import { Landing } from '../components/landing'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Landing />
}