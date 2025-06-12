import { createFileRoute } from '@tanstack/react-router'
import { ProfilePageLayout } from '../../components/profile-page'

export const Route = createFileRoute('/(profile)/_profileLayout')({
  component: ProfilePageLayout,
})