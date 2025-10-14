import { useQuery } from '@apollo/client'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { GET_PRODUCT } from '@/graphql/product'
import type { ProductSpecification, ProductType } from '@/types'
import { ProductReviews } from '../../components/product-reviews/product-reviews'
import { Separator } from '../../components/ui/separator'
import { ProductOverview } from './components/product-overview'
import { ProductOverviewTabs } from './components/product-overview-tabs'
import { ProductPageDetails } from './components/product-page-details'
import { ProductPageFulfilmentBadge } from './components/product-page-fulfilment-badge'
import { ProductPageImage } from './components/product-page-image'
import { ProdcutPagePrice } from './components/product-page-price'
import { ProductPageRates } from './components/product-page-rates'
import { ProductPageTitle } from './components/product-page-title'
import { Button } from '../../components/ui/button'
import { AddToWishlistButton } from './components/add-to-wishlist-button'
import { ProductPageLoadingSkeleton } from './components/product-page-loading-skeleton'
import { cn } from '@/utils/cn'
import Breadcrumb from '../../components/category/breadcrumb'

export function ProductPage() {
  const { productId } = useParams({
    from: '/(main)/_homeLayout/$title/$productId/',
  })
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null)

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

    let matchingProduct = allGroupProducts.find(product => {
      return product.productAttributes?.some(attr =>
        attr.attribute_name === attributeName && attr.attribute_value === attributeValue
      )
    })

    if (!matchingProduct) {
      matchingProduct = allGroupProducts.find(product => {
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


      navigate({ to: "/$title/$productId", params: { title: urlTitle, productId: matchingProduct.id } })
    }
  }

  if (loading) return <ProductPageLoadingSkeleton />

  return (
    <main aria-label="Product Page" className="!scroll-smooth mb-32 overflow-x-hidden bg-white">
      {currentProduct?.category_id && (
        <Breadcrumb categoryId={currentProduct.category_id} className="border-b border-gray-200" />
      )}

      <section
        aria-labelledby="product-main-section"
        className="site-container relative flex w-full flex-col items-start justify-start space-y-10 px-5 pt-10 lg:flex-row lg:space-x-10 lg:space-y-0 ">
        <div className="fixed bottom-0 left-0 z-10 flex w-full items-center bg-white px-2 py-2 md:hidden">
          <button className="flex h-[60px] w-[55px] flex-col items-center justify-center border border-[#f1f3f9] bg-white p-[3px] px-[10px] text-inherit">
            <span className="text-[#8d94a7] text-[1rem]">Qty</span>
            <span className="font-bold text-[1.5rem] text-inherit">1</span>
          </button>
          <Button className="h-[48px] w-full cursor-pointer rounded-[4px] bg-[#2B4CD7] font-bold text-[14px] text-white uppercase transition-colors hover:bg-[#6079E1]">
            Add to cart
          </Button>
        </div>
        <div className="mb-0 block md:hidden">
          <ProductPageTitle
            key={`title-mobile-${selectedProduct?.id}`}
            className="block text-[18px] md:hidden"
            title={selectedProduct?.name as string}
          />
          <div className="mt-6 mb-4 flex w-full items-center justify-between ">
            <ProductPageRates theme="mobile" />
            <AddToWishlistButton />
          </div>
        </div>
        <ProductPageImage
          key={selectedProduct?.id}
          images={productImages.map((image) => image.image_url) || ['']}
        />

        <div
          className="flex w-full flex-col items-start justify-center lg:w-[calc(500/1200*100%)]"
          aria-labelledby="product-info-section">
          <ProductPageTitle
            key={`title-desktop-${selectedProduct?.id}`}
            className="hidden md:block"
            title={selectedProduct?.name as string}
          />
          <div className="hidden md:block">
            <ProductPageRates />
          </div>
          <ProdcutPagePrice
            key={`price-${selectedProduct?.id}`}
            price={selectedProduct?.price as number}
            currency={selectedProduct?.currency as string}
            discount_percentage={selectedProduct?.discount_percentage || 0}
            final_price={selectedProduct?.final_price || 0}
          />
          <ProductPageFulfilmentBadge />
          <Separator className="my-5" />


          {Object.keys(attributeOptions).length > 0 && allGroupProducts.filter(p => p.is_public).length > 1 && (
            <div className="w-full space-y-6 mb-6">
              {Object.entries(attributeOptions).map(([attributeName, values]) => {
                const selectedValue = selectedAttributes[attributeName]


                const publicValues = Array.from(values).filter(value => {
                  const productWithAttr = allGroupProducts.find(p =>
                    p.productAttributes?.some(attr =>
                      attr.attribute_name === attributeName && attr.attribute_value === value
                    )
                  )

                  return productWithAttr && (productWithAttr.is_public || selectedValue === value)
                })


                if (publicValues.length <= 1) return null

                return (
                  <div key={attributeName} className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 uppercase">
                      {attributeName}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {publicValues.map((value) => {
                        const isSelected = selectedValue === value


                        const productWithAttr = allGroupProducts.find(p =>
                          p.productAttributes?.some(attr =>
                            attr.attribute_name === attributeName && attr.attribute_value === value
                          )
                        )
                        const hasImage = productWithAttr?.images && productWithAttr.images.length > 0

                        return (
                          <button
                            key={value}
                            onClick={() => handleAttributeSelect(attributeName, value)}
                            className={cn(
                              "relative border-2 cursor-pointer rounded-lg transition-all duration-200 transform hover:scale-105",
                              isSelected
                                ? "border-[#2B4CD7] shadow-md ring-2 ring-[#2B4CD7] ring-opacity-20"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm",
                            )}
                          >
                            {hasImage ? (
                              <div className="p-2">
                                <div className="w-16 h-16 relative rounded overflow-hidden">
                                  <img
                                    src={productWithAttr.images[0].image_url}
                                    alt={value}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="mt-2 text-xs text-center font-medium">
                                  {value}
                                </p>
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
            <ProductPageDetails product={selectedProduct as ProductType} theme="mobile" />
          </div>
        </div>
        <div className="max-md:hidden">
          <ProductPageDetails product={selectedProduct as ProductType} />
        </div>
      </section>
      <section id="porduct_overview">
        <Separator className="mt-16 mb-5 h-[9px] bg-[#F3F4F8]" />
        <ProductOverviewTabs />
      </section>
      <section className="site-container mt-10">
        <ProductOverview
          overview={selectedProduct?.product_overview as string}
          specs={selectedProduct?.productSpecifications as ProductSpecification[]}
        />
      </section>

      <Separator className="mt-20 mb-5 h-[9px] bg-[#F3F4F8]" />
      <ProductReviews />
    </main>
  )
}
