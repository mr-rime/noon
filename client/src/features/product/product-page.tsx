import { useMutation, useQuery } from '@apollo/client'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { GET_PRODUCT } from '@/features/product/api/product'
import { ADD_CART_ITEM, GET_CART_ITEMS } from '@/features/cart/api/cart'
import type { ProductSpecification, ProductType } from '@/shared/types'
import { ProductReviews } from '@/shared/components/product-reviews/product-reviews'
import { Separator } from '@/shared/components/ui/separator'
import { ProductOverview } from '@/features/product/components/product-overview'
import { ProductOverviewTabs } from '@/features/product/components/product-overview-tabs'
import { ProductPageDetails } from '@/features/product/components/product-page-details'
import { ProductPageFulfilmentBadge } from '@/features/product/components/product-page-fulfilment-badge'
import { ProductPageImage } from '@/features/product/components/product-page-image'
import { ProdcutPagePrice } from '@/features/product/components/product-page-price'
import { ProductPageRates } from '@/features/product/components/product-page-rates'
import { ProductPageTitle } from '@/features/product/components/product-page-title'
import { AddToWishlistButton } from '@/features/product/components/add-to-wishlist-button'
import { ProductPageLoadingSkeleton } from '@/features/product/components/product-page-loading-skeleton'
import { cn } from '@/shared/utils/cn'
import Breadcrumb from '@/shared/components/category/breadcrumb'
import { ModalDialog } from '@/shared/components/ui/modal-dialog/modal-dialog'
import { toast } from 'sonner'
import { Image } from '@unpic/react'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

export function ProductPage() {
  const { productId } = useParams({
    from: '/(main)/_homeLayout/$title/$productId/',
  })
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false)
  const [isAddedModalOpen, setIsAddedModalOpen] = useState(false)

  const { data, loading } = useQuery<{
    getProduct: {
      success: boolean
      message: string
      product: ProductType
    }
  }>(GET_PRODUCT, { variables: { id: productId } })

  const currentProduct = data?.getProduct?.product

  const navigate = useNavigate();


  useEffect(() => {
    if (currentProduct) {
      setSelectedProduct(currentProduct)
    }
  }, [currentProduct])





  const allGroupProducts = useMemo(() => {
    if (!currentProduct) return []


    if (!currentProduct.groupProducts || currentProduct.groupProducts.length === 0) {
      return [currentProduct]
    }


    const publicProducts = currentProduct.groupProducts.filter(product => product.is_public)



    const currentProductInGroup = currentProduct.groupProducts.find(p => p.id === currentProduct.id)
    if (currentProductInGroup && !currentProductInGroup.is_public && !publicProducts.find(p => p.id === currentProduct.id)) {
      publicProducts.push(currentProductInGroup)
    }

    return publicProducts
  }, [currentProduct])

  const productImages = selectedProduct?.images
    ? [...selectedProduct.images].sort(
      (a, b) => Number(b.is_primary ?? false) - Number(a.is_primary ?? false)
    )
    : []

  const safeStockCount = Number(selectedProduct?.stock ?? currentProduct?.stock ?? 0)
  const maxSelectableQuantity = safeStockCount > 0 ? Math.min(safeStockCount, 10) : 1
  const isOutOfStock = safeStockCount <= 0

  useEffect(() => {
    setQuantity(1)
  }, [productId])

  useEffect(() => {
    if (safeStockCount > 0) {
      setQuantity((prev) => Math.min(prev, maxSelectableQuantity))
    }
  }, [safeStockCount, maxSelectableQuantity])

  const [addCartItemMutation, { loading: addToCartLoading }] = useMutation(ADD_CART_ITEM, {
    refetchQueries: [GET_CART_ITEMS],
    awaitRefetchQueries: true,
  })

  const addItemToCart = async ({ showConfirmation = true }: { showConfirmation?: boolean } = {}) => {
    if (!productId) return false
    try {
      const { data } = await addCartItemMutation({
        variables: { product_id: productId, quantity },
      })

      if (data?.addToCart?.success) {
        if (showConfirmation) {
          setIsAddedModalOpen(true)
        }
        return true
      }

      toast.error(data?.addToCart?.message || 'Failed to add product to cart. Please try again.')
      return false
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error('An error occurred while adding the product to cart.')
      return false
    }
  }

  const handleAddToCart = async () => {
    if (isOutOfStock) return
    await addItemToCart({ showConfirmation: true })
  }

  const handleBuyNow = async () => {
    if (isOutOfStock) return
    const success = await addItemToCart({ showConfirmation: false })
    if (success) {
      navigate({ to: '/cart' })
    }
  }

  const attributeOptions = useMemo(() => {
    const options: Record<string, Set<string>> = {}


    allGroupProducts.forEach(product => {
      product.productAttributes?.forEach(attr => {
        if (!options[attr.attribute_name]) {
          options[attr.attribute_name] = new Set()
        }
        options[attr.attribute_name].add(attr.attribute_value)
      })
    })



    if (allGroupProducts.length > 1 && Object.keys(options).length === 0) {
      options['Color'] = new Set()

      allGroupProducts.forEach(product => {
        const productName = product.name?.toLowerCase() || ''


        if (productName.includes('black')) {
          options['Color'].add('Black')
        } else if (productName.includes('white')) {
          options['Color'].add('White')
        } else if (productName.includes('orange')) {
          options['Color'].add('Cosmic Orange')
        } else if (productName.includes('blue')) {
          options['Color'].add('Deep Blue')
        } else if (productName.includes('red')) {
          options['Color'].add('Red')
        } else if (productName.includes('green')) {
          options['Color'].add('Green')
        } else {
          const colors = ['Black', 'White', 'Cosmic Orange', 'Deep Blue', 'Red', 'Green']
          const colorIndex = allGroupProducts.findIndex(p => p.id === product.id)
          if (colorIndex >= 0 && colorIndex < colors.length) {
            options['Color'].add(colors[colorIndex])
          }
        }
      })
    }

    allGroupProducts.forEach((product, index) => {
      console.log(`Product ${index + 1} (${product.id}):`, product.productAttributes)
    })

    return options
  }, [allGroupProducts])


  const selectedAttributes = useMemo(() => {
    const attrs: Record<string, string> = {}


    selectedProduct?.productAttributes?.forEach(attr => {
      attrs[attr.attribute_name] = attr.attribute_value
    })


    if (Object.keys(attrs).length === 0 && selectedProduct?.name) {
      const productName = selectedProduct.name.toLowerCase()

      if (productName.includes('black')) {
        attrs['Color'] = 'Black'
      } else if (productName.includes('white')) {
        attrs['Color'] = 'White'
      } else if (productName.includes('orange')) {
        attrs['Color'] = 'Cosmic Orange'
      } else if (productName.includes('blue')) {
        attrs['Color'] = 'Deep Blue'
      } else if (productName.includes('red')) {
        attrs['Color'] = 'Red'
      } else if (productName.includes('green')) {
        attrs['Color'] = 'Green'
      }
    }

    return attrs
  }, [selectedProduct])

  const handleAttributeSelect = async (attributeName: string, attributeValue: string) => {
    let matchingProduct = allGroupProducts.find((product) =>
      product.productAttributes?.some(
        (attr) => attr.attribute_name === attributeName && attr.attribute_value === attributeValue,
      ),
    )

    if (!matchingProduct) {
      matchingProduct = allGroupProducts.find((product) => {
        const productName = product.name?.toLowerCase() || ''
        const colorValue = attributeValue.toLowerCase()

        if (colorValue === 'black' && productName.includes('black')) return true
        if (colorValue === 'white' && productName.includes('white')) return true
        if (colorValue === 'cosmic orange' && productName.includes('orange')) return true
        if (colorValue === 'deep blue' && productName.includes('blue')) return true
        if (colorValue === 'red' && productName.includes('red')) return true
        if (colorValue === 'green' && productName.includes('green')) return true

        return false
      })
    }

    if (!matchingProduct && allGroupProducts.length > 1) {
      const colorIndex = ['black', 'white', 'cosmic orange', 'deep blue', 'red', 'green'].indexOf(attributeValue.toLowerCase())
      if (colorIndex >= 0 && colorIndex < allGroupProducts.length) {
        matchingProduct = allGroupProducts[colorIndex]
      }
    }

    if (matchingProduct && matchingProduct.id !== currentProduct?.id) {
      const urlTitle = matchingProduct.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      navigate({ to: '/$title/$productId', params: { title: urlTitle, productId: matchingProduct.id } })
    }
  }

  if (loading || !selectedProduct) {
    return <ProductPageLoadingSkeleton />
  }

  return (
    <main aria-label="Product Page" className="!scroll-smooth mb-32 overflow-x-hidden bg-white">
      {currentProduct?.category_id && (
        <Breadcrumb categoryId={currentProduct.category_id} className="border-b border-gray-200" />
      )}

      <section
        aria-labelledby="product-main-section"
        className="site-container relative flex w-full flex-col items-start justify-start space-y-10 px-5 pt-10 lg:flex-row lg:space-x-10 lg:space-y-0">
        <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#EAECF0] bg-white px-3 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex min-w-[70px] flex-col text-xs font-semibold text-[#6f7285]">
              <span>Qty</span>
              <button
                type="button"
                onClick={() => setIsQuantityModalOpen(true)}
                className="mt-1 rounded-[10px] border border-[#DADCE3] px-3 py-1 text-base font-bold text-[#20232a]"
                aria-label="Change quantity"
                disabled={isOutOfStock}>
                {quantity}
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCartLoading}
              className="flex h-[52px] flex-1 items-center justify-center rounded-[12px] bg-[#2B4CD7] text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#1e36a5] disabled:cursor-not-allowed disabled:opacity-60">
              Add to cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock || addToCartLoading}
              className="flex h-[52px] flex-1 items-center justify-center rounded-[12px] border border-[#2B4CD7] text-sm font-bold uppercase tracking-wide text-[#2B4CD7] transition-colors hover:bg-[#eef1ff] disabled:cursor-not-allowed disabled:opacity-60">
              Buy now
            </button>
          </div>
        </div>

        <div className="mb-0 block md:hidden">
          <ProductPageTitle className="block text-[18px] md:hidden" title={selectedProduct.name as string} />
          <div className="mt-6 mb-4 flex w-full items-center justify-between">
            <ProductPageRates theme="mobile" product={selectedProduct || undefined} />
            <AddToWishlistButton />
          </div>
        </div>

        <ProductPageImage key={selectedProduct.id} images={productImages.map((image) => image.image_url) || ['']} />

        <div className="flex w-full flex-col items-start justify-center lg:w-[calc(500/1200*100%)]" aria-labelledby="product-info-section">
          <ProductPageTitle className="hidden md:block" title={selectedProduct.name as string} />
          <div className="hidden md:block">
            <ProductPageRates product={selectedProduct || undefined} />
          </div>
          <ProdcutPagePrice
            price={selectedProduct.price as number}
            currency={selectedProduct.currency as string}
            discount_percentage={selectedProduct.discount_percentage || 0}
            final_price={selectedProduct.final_price || 0}
          />
          <ProductPageFulfilmentBadge />
          <Separator className="my-5" />

          {Object.keys(attributeOptions).length > 0 && allGroupProducts.filter((p) => p.is_public).length > 1 && (
            <div className="mb-6 w-full space-y-6">
              {Object.entries(attributeOptions).map(([attributeName, values]) => {
                const selectedValue = selectedAttributes[attributeName]

                const publicValues = Array.from(values).filter((value) => {
                  const productWithAttr = allGroupProducts.find((p) =>
                    p.productAttributes?.some((attr) => attr.attribute_name === attributeName && attr.attribute_value === value),
                  )

                  return productWithAttr && (productWithAttr.is_public || selectedValue === value)
                })

                if (publicValues.length <= 1) return null

                return (
                  <div key={attributeName} className="space-y-3">
                    <h3 className="text-sm font-medium uppercase text-gray-700">{attributeName}</h3>
                    <div className="flex flex-wrap gap-3">
                      {publicValues.map((value) => {
                        const isSelected = selectedValue === value
                        const productWithAttr = allGroupProducts.find((p) =>
                          p.productAttributes?.some((attr) => attr.attribute_name === attributeName && attr.attribute_value === value),
                        )
                        const hasImage = productWithAttr?.images && productWithAttr.images.length > 0

                        return (
                          <button
                            key={value}
                            onClick={() => handleAttributeSelect(attributeName, value)}
                            className={cn(
                              'relative rounded-lg border-2 transition-all duration-200 hover:scale-105 hover:border-gray-300 hover:shadow-sm',
                              isSelected
                                ? 'border-[#2B4CD7] shadow-md ring-2 ring-[#2B4CD7]/20'
                                : 'border-gray-200',
                            )}>
                            {hasImage ? (
                              <div className="p-2">
                                <div className="relative h-16 w-16 overflow-hidden rounded">
                                  <img src={productWithAttr?.images?.[0].image_url} alt={value} className="h-full w-full object-cover" />
                                </div>
                                <p className="mt-2 text-center text-xs font-medium">{value}</p>
                              </div>
                            ) : (
                              <div className="px-4 py-3">
                                <p className="text-sm font-medium">{value}</p>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-start justify-center md:hidden">
          <div className="w-full">
            <ProductPageDetails
              product={selectedProduct as ProductType}
              theme="mobile"
              quantity={quantity}
              onQuantityClick={() => setIsQuantityModalOpen(true)}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              addToCartLoading={addToCartLoading}
            />
          </div>
        </div>

        <div className="hidden w-full md:block md:max-w-sm">
          <ProductPageDetails
            product={selectedProduct as ProductType}
            quantity={quantity}
            onQuantityClick={() => setIsQuantityModalOpen(true)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            addToCartLoading={addToCartLoading}
          />
        </div>
      </section>

      <section id="product_overview">
        <Separator className="mt-16 mb-5 h-[9px] bg-[#F3F4F8]" />
        <ProductOverviewTabs />
      </section>

      <section className="site-container mt-10">
        <ProductOverview
          overview={(selectedProduct.product_overview || currentProduct?.product_overview) as string}
          specs={(selectedProduct.productSpecifications || currentProduct?.productSpecifications) as ProductSpecification[]}
        />
      </section>

      <Separator className="mt-20 mb-5 h-[9px] bg-[#F3F4F8]" />
      <ProductReviews productId={productId} />

      {isQuantityModalOpen && !isOutOfStock && (
        <ModalDialog
          onClose={() => setIsQuantityModalOpen(false)}
          className="w-[90%] max-w-sm overflow-hidden p-0"
          header={
            <div className="px-6 pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#20232a]">Quantity</h3>
              </div>
            </div>
          }
          content={
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: maxSelectableQuantity }, (_, idx) => idx + 1).map((value) => {
                  const isSelected = value === quantity
                  return (
                    <button
                      type="button"
                      key={value}
                      onClick={() => {
                        setQuantity(value)
                        setIsQuantityModalOpen(false)
                      }}
                      className={cn(
                        'rounded-[12px] border px-4 py-3 text-center text-base font-semibold transition-colors',
                        isSelected
                          ? 'border-[#2B4CD7] bg-[#eef1ff] text-[#2B4CD7]'
                          : 'border-[#E1E4ED] text-[#20232a] hover:border-[#c5c9da]',
                      )}>
                      {value}
                    </button>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-[#7e859b]">Maximum {maxSelectableQuantity} per order.</p>
            </div>
          }
        />
      )}

      {isAddedModalOpen && (
        <ModalDialog
          onClose={() => setIsAddedModalOpen(false)}
          className="w-[90%] max-w-sm overflow-hidden p-0"
          header={
            <div className="px-6 pt-6 mb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f5e9]">
                  <CheckCircle2 className="text-[#2B4CD7]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-[#20232a]">Added to cart</p>
                  <p className="text-xs text-[#7e859b]">Great choice!</p>
                </div>
              </div>
            </div>
          }
          content={
            <div className="px-6 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#f5f6fb]">
                  {productImages[0]?.image_url ? (
                    <Image
                      src={productImages[0].image_url}
                      alt={selectedProduct?.name || 'Product image'}
                      width={64}
                      height={64}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-[#7e859b]">No image</span>
                  )}
                </div>
                <div className="flex-1 text-sm text-[#20232a]">
                  <p className="line-clamp-3 font-medium">{selectedProduct?.name}</p>
                </div>
              </div>
            </div>
          }
          footer={
            <div className="grid grid-cols-2 gap-3 px-6 pb-6">
              <button className="rounded-[12px] cursor-pointer border border-[#DADCE3] py-3 text-sm font-semibold text-[#404553]" onClick={() => setIsAddedModalOpen(false)}>
                Continue Shopping
              </button>
              <Button
                className="rounded-[12px] bg-[#2B4CD7] py-3 text-sm font-semibold text-white"
                onClick={() => {
                  setIsAddedModalOpen(false)
                  navigate({ to: '/cart' })
                }}>
                View Cart
              </Button>
            </div>
          }
        />
      )}
    </main>
  )
}
