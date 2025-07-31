import { useMutation } from '@apollo/client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { CREATE_PRODUCT } from '@/graphql/product'
import { useProductStore } from '@/store/create-product-store'
import { NewProductImages } from './components/new-product-images'
import { NewProductInformation } from './components/new-product-information'

const crumbs = [
  {
    label: 'Products',
    href: '/dashboard/products',
  },
  {
    label: 'New Product',
    href: '/dashboard/products/new',
  },
]

export function NewProduct() {
  const [createNewProduct, { loading }] = useMutation(CREATE_PRODUCT)
  const productData = useProductStore((state) => state.product)
  const reset = useProductStore((state) => state.reset)

  const handleCreateNewProduct = async () => {
    try {
      const { data } = await createNewProduct({
        variables: {
          ...productData,
          images: productData.images,
        },
      })

      toast.success(data.createProduct.message)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen w-full px-10 py-20">
      <div className="mb-5">
        <Breadcrumb onClick={reset} items={crumbs} />
      </div>

      <div className="min-h-[calc(100vh-160px)] w-full rounded-[8px] bg-white p-5">
        <h2 className="mb-5">Add Product</h2>
        <div className="flex min-h-full w-full items-start max-md:flex-col max-md:space-y-5 md:space-x-7">
          <NewProductImages />
          <NewProductInformation />
        </div>
        <div className="mt-5 flex w-full items-start justify-end">
          {loading ? (
            <Button className="flex w-full items-center justify-center rounded-md bg-[#3866df] px-4 py-2 text-white md:w-[100px]">
              <Loader2 size={20} className="animate-spin" />
            </Button>
          ) : (
            <Button
              onClick={handleCreateNewProduct}
              className="w-full rounded-md bg-[#3866df] px-4 py-2 text-white md:w-[100px]">
              Publish
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
