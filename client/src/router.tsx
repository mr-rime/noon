import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
  context: { subdomain: undefined! },
})

export type AppRouter = typeof router
