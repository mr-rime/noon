import { createLazyFileRoute } from '@tanstack/react-router'
import { ProfileInformation } from '../../../../../../components/profile-page/components/profile-information'

export const Route = createLazyFileRoute('/(main)/_homeLayout/(profile)/_profileLayout/profile/')({
  component: ProfileInformation,
})

