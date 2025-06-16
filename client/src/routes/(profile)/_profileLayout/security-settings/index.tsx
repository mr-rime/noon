import { createFileRoute } from '@tanstack/react-router'
import { SecuritySettings } from '../../../../components/profile-page/components/security-settings'

export const Route = createFileRoute(
  '/(profile)/_profileLayout/security-settings/',
)({
  component: SecuritySettings,
})