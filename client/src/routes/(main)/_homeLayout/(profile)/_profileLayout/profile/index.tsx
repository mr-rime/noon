import { createFileRoute } from '@tanstack/react-router'
import { ProfileInformation } from '../../../../../../components/profile-page/components/profile-information'

export const Route = createFileRoute('/(main)/_homeLayout/(profile)/_profileLayout/profile/')({
  component: ProfileInformation,
})

