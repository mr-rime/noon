export interface Banner {
  id: string
  name: string
  placement: string
  description?: string
  target_url?: string
  image_url?: string
  mobile_image_url?: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at?: string
}

export interface BannerListResponse {
  getBanners: {
    banners: Banner[]
    total: number
  }
}

export interface BannerResponse {
  success: boolean
  message?: string
  banner?: Banner
}

export const BANNER_PLACEMENTS = [
  { value: 'home_hero', label: 'Home Hero Banner' },
  { value: 'home_secondary', label: 'Home Secondary Banner' },
  { value: 'category_top', label: 'Category Top Banner' },
  { value: 'product_sidebar', label: 'Product Sidebar' },
  { value: 'checkout_top', label: 'Checkout Top' },
  { value: 'footer_banner', label: 'Footer Banner' },
  { value: 'popup', label: 'Popup Banner' },
  { value: 'image_slider', label: 'Image Slider' },
  { value: 'mobile_home', label: 'Mobile Home Banner' },
  { value: 'mobile_category', label: 'Mobile Category Banner' }
]

export const getBannerPlacementLabel = (value: string): string => {
  const placement = BANNER_PLACEMENTS.find(p => p.value === value)
  return placement?.label || value
}
