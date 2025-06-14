import { createFileRoute } from '@tanstack/react-router'
import { ProfileInformation } from '../../../../components/profile-page/components/profile-information'

export const Route = createFileRoute('/(profile)/_profileLayout/profile/')({
  component: ProfileInformation,
})

