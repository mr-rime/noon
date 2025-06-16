import { createFileRoute } from '@tanstack/react-router'
import { Addresses } from '../../../../components/profile-page/components/addresses'

export const Route = createFileRoute('/(profile)/_profileLayout/addresses/')({
  component: Addresses,
})