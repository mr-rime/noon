import { createFileRoute } from '@tanstack/react-router'
import { ProfilePageLayout } from '../../../../components/profile-page'

export const Route = createFileRoute('/(main)/_homeLayout/(profile)/_profileLayout')({
  component: ProfilePageLayout,
})