import { Link } from '@tanstack/react-router'
import { Star } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug?: string
  price: number
  final_price?: number
  currency?: string
  product_overview?: string
  images?: {
    image_url: string
    is_primary?: boolean
  }[]
  brand?: {
    name: string
  }
  rating?: number
  review_count?: number
  discount_percentage?: number
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || 
                       product.images?.[0]?.image_url || 
                       '/placeholder.jpg'
  
  const productSlug = product.slug || 
                      product.name.toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '')
  
  const displayPrice = product.final_price || product.price
  const hasDiscount = product.discount_percentage && product.discount_percentage > 0
  
  return (
    <Link
      to={`/$title/$productId`}
      params={{ 
        title: productSlug,
        productId: product.id 
      }}
      className="group block bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
    >
      <div className="aspect-square p-4 bg-gray-50">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>
      
      <div className="p-3">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 mb-1">{product.brand.name}</p>
        )}
        
        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-gray-600">
              {product.rating.toFixed(1)}
            </span>
            {product.review_count && product.review_count > 0 && (
              <span className="text-xs text-gray-500">
                ({product.review_count})
              </span>
            )}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {product.currency || 'AED'} {displayPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-500 line-through">
                {product.price.toFixed(2)}
              </span>
              <span className="text-xs text-green-600 font-medium">
                {product.discount_percentage}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
