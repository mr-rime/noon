export function matchesExpectedRoute(pathname: string, expectedRoutes?: string[]): boolean {
  if (!expectedRoutes?.length) {
    if (pathname.includes(':')) {
      const pattern = new RegExp('^' + pathname.replace(/:[^/]+/g, '[^/]+') + '$')
      return pattern.test(pathname)
    }
  }
  return (
    expectedRoutes?.some((route) => {
      if (route.includes(':')) {
        const pattern = new RegExp('^' + route.replace(/:[^/]+/g, '[^/]+') + '$')
        return pattern.test(pathname)
      }
      return route === pathname
    }) ?? false
  )
}
