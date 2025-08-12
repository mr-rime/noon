import { useMutation, useQuery } from '@apollo/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { GET_PRODUCT, UPDATE_PRODUCT } from '@/graphql/product'
import { useProductStore } from '@/store/create-product-store'
import { EditProductInformation } from './components/edit-product-information'
import { useParams } from '@tanstack/react-router'
import type { ProductType } from '@/types'
import { EditProductImages } from './components/edit-product-images'

const crumbs = [
  {
    label: 'Products',
    href: '/dashboard/products',
  },
  {
    label: 'Edit Product',
    href: '/dashboard/products/edit',
  },
]

export function EditProduct() {
  const { productId } = useParams({ from: '/(dashboard)/_dashboardLayout/d/products/edit/$productId/' })
  const { data: product, loading: prodcutLoading } = useQuery<{
    getProduct: { success: boolean; message: string; product: ProductType }
  }>(GET_PRODUCT, { variables: { id: productId } })
  const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT)
  const productData = useProductStore((state) => state.product)
  const reset = useProductStore((state) => state.reset)

  const handleEditProduct = async () => {
    try {
      const { data } = await updateProduct({
        variables: {
          ...productData,
          id: productId,
          images: productData.images,
        },
      })

      toast.success(data.createProduct.message)
    } catch (err) {
      console.error(err)
    }
  }

  if (prodcutLoading) return 'loading...'
  return (
    <div className="min-h-screen w-full px-10 py-20">
      <div className="mb-5">
        <Breadcrumb onClick={reset} items={crumbs} />
      </div>

      <div className="min-h-[calc(100vh-160px)] w-full rounded-[8px] bg-white p-5">
        <h2 className="mb-5">Add Product</h2>
        <div className="flex min-h-full w-full items-start max-md:flex-col max-md:space-y-5 md:space-x-7">
          <EditProductImages product={product?.getProduct.product!} />
          <EditProductInformation product={product?.getProduct.product!} />
        </div>
        <div className="mt-5 flex w-full items-start justify-end">
          {loading ? (
            <Button className="flex w-full items-center justify-center rounded-md bg-[#3866df] px-4 py-2 text-white md:w-[100px]">
              <Loader2 size={20} className="animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={handleEditProduct}
              className="w-full rounded-md bg-[#3866df] px-4 py-2 text-white md:w-[100px]">
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
