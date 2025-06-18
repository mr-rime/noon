import { createFileRoute } from '@tanstack/react-router'
import { Returns } from '../../../../../../components/profile-page/components/returns'

export const Route = createFileRoute('/(main)/_homeLayout/(profile)/_profileLayout/returns/')({
  component: Returns
})

