import { useCallback } from 'react'
import { type Banner } from '@/types/banner'

export function useBannerAnalytics() {
  const trackBannerView = useCallback((banner: Banner) => {
    console.log('Banner viewed:', {
      id: banner.id,
      name: banner.name,
      placement: banner.placement,
      timestamp: new Date().toISOString()
    })
    
  }, [])

  const trackBannerClick = useCallback((banner: Banner) => {
    console.log('Banner clicked:', {
      id: banner.id,
      name: banner.name,
      placement: banner.placement,
      target_url: banner.target_url,
      timestamp: new Date().toISOString()
    })
    
  }, [])

  const trackBannerDismiss = useCallback((banner: Banner) => {
    console.log('Banner dismissed:', {
      id: banner.id,
      name: banner.name,
      placement: banner.placement,
      timestamp: new Date().toISOString()
    })
    
  }, [])

  return {
    trackBannerView,
    trackBannerClick,
    trackBannerDismiss
  }
}
