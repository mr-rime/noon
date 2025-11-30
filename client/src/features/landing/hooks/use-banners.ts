import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { GET_ACTIVE_BANNERS_BY_PLACEMENT, GET_ALL_ACTIVE_BANNERS } from '@/features/landing/api/banner-display'
import { type Banner } from '@/shared/types/banner'

export function useBannersByPlacement(placement: string) {
  const { data, loading, error } = useQuery(GET_ACTIVE_BANNERS_BY_PLACEMENT, {
    variables: { placement },
    errorPolicy: 'ignore',
    fetchPolicy: 'cache-first'
  })

  return {
    banners: (data?.getActiveBannersByPlacement || []) as Banner[],
    loading,
    error,
    hasBanners: Boolean(data?.getActiveBannersByPlacement?.length)
  }
}

export function useAllActiveBanners() {
  const { data, loading, error } = useQuery(GET_ALL_ACTIVE_BANNERS, {
    errorPolicy: 'ignore',
    fetchPolicy: 'cache-first'
  })

  const bannersByPlacement = useMemo(() => {
    if (!data?.getBanners?.banners) return {}

    const banners = data.getBanners.banners as Banner[]
    return banners.reduce((acc, banner) => {
      if (!acc[banner.placement]) {
        acc[banner.placement] = []
      }
      acc[banner.placement].push(banner)
      return acc
    }, {} as Record<string, Banner[]>)
  }, [data])

  return {
    bannersByPlacement,
    allBanners: (data?.getBanners?.banners || []) as Banner[],
    total: data?.getBanners?.total || 0,
    loading,
    error
  }
}

export function useShouldShowBanners(placement: string) {
  const { hasBanners, loading } = useBannersByPlacement(placement)

  return {
    shouldShow: hasBanners && !loading,
    loading
  }
}
