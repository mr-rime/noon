import { useMutation } from '@apollo/client'
import { Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Dropzone } from '@/components/ui/dropzone'
import { Skeleton } from '@/components/ui/skeleton'
import { UPLOAD_FILE } from '@/graphql/upload-file'
import { useProductStore } from '@/store/create-product-store'
import type { ProductType } from '@/types'
import { Image } from '@unpic/react'

type ProductImageFile = {
  file: File | null
  imgUrl: string
  name: string
  size: string
  type: string
  loading: boolean
}

export function EditProductImages({ product }: { product: ProductType }) {
  const [uploadImage] = useMutation(UPLOAD_FILE)
  const [files, setFiles] = useState<ProductImageFile[]>([])
  const setProduct = useProductStore((state) => state.setProduct)

  useEffect(() => {
    if (product?.images?.length) {
      const placeholders = product.images.map((img, idx) => ({
        file: null,
        imgUrl: img.image_url,
        name: `existing-${idx}`,
        size: '',
        type: 'image',
        loading: false,
      }))

      setFiles(placeholders)
    }
  }, [product])

  useEffect(() => {
    const images = product.images.map((img) => ({
      image_url: img.image_url,
      is_primary: img.is_primary,
    }))
    console.log(images)
    setProduct({ images })
  }, [])

  const handleFiles = async (incomingFiles: File[]) => {
    try {
      const existingFileNames = new Set(files.map((f) => f.name))
      const newUniqueFiles = incomingFiles.filter((file) => !existingFileNames.has(file.name))
      if (newUniqueFiles.length === 0) return

      const placeholders: ProductImageFile[] = newUniqueFiles.map((file) => ({
        file,
        imgUrl: '',
        name: file.name,
        size: '',
        type: file.type,
        loading: true,
      }))

      setFiles((prev) => [...prev, ...placeholders])

      const uploadedFiles = await Promise.all(
        newUniqueFiles.map(async (file) => {
          const { data } = await uploadImage({ variables: { file } })
          const uploadedUrl = data?.uploadImage?.url
          if (!uploadedUrl) return null

          return {
            file,
            imgUrl: uploadedUrl,
            name: file.name,
            size:
              file.size > 1024 * 1024
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                : `${(file.size / 1024).toFixed(2)} KB`,
            type: file.type,
            loading: false,
          }
        }),
      )

      const validFiles = uploadedFiles.filter((f) => !!f)

      setFiles((prev) =>
        prev.map((f) => {
          const match = validFiles.find((v) => v && v.name === f.name)
          return match ?? f
        }),
      )

      const updatedImages = [...files, ...validFiles]
        .filter((f): f is ProductImageFile => !!f && !!f.imgUrl)
        .map((f, idx) => ({
          image_url: f.imgUrl,
          is_primary: idx === 0,
        }))

      setProduct({ images: updatedImages })
    } catch (err) {
      console.error('Error uploading files:', err)
    }
  }

  const handleDelete = (idx: number) => {
    setFiles((prev) => {
      const updated = [...prev]
      updated.splice(idx, 1)

      const remainingImages = updated
        .filter((f) => f.imgUrl)
        .map((f, i) => ({
          image_url: f.imgUrl,
          is_primary: i === 0,
        }))

      setProduct({ images: remainingImages })

      return updated
    })
  }

  return (
    <div className="w-full overflow-y-auto rounded-xl border border-[#E4E4E7] p-5 md:h-[calc(100vh-160px)] md:w-1/2">
      <div className="mb-2 text-[#6B6D6E]">Add Images</div>
      <Dropzone accept="image/*" onFilesDrop={handleFiles} className="h-[250px] w-full" />
      <div className="mt-8 flex flex-col items-start justify-center space-y-3">
        {files.map((file, idx) => (
          <ProductImageFileComponent key={file.imgUrl + idx} {...file} onDelete={() => handleDelete(idx)} />
        ))}
      </div>
    </div>
  )
}

function ProductImageFileComponent({
  name,
  size,
  imgUrl,
  loading,
  onDelete,
}: ProductImageFile & { onDelete: () => void }) {
  return (
    <div className="flex w-full items-center justify-between rounded-[10px] border border-[#E4E4E7] p-2">
      <div className="flex items-center space-x-2">
        {loading ? (
          <Skeleton className="h-[70px] w-[70px] rounded-[10px]" />
        ) : (
          <div className="h-[70px] w-[70px] overflow-hidden rounded-[10px] bg-[#F8F8F8] p-2">
            <Image
              src={imgUrl}
              alt={name}
              className="h-full w-full object-cover"
              width={70}
              height={70}
              layout="constrained"
            />
          </div>
        )}
        <div>
          <div className="text-[17px]">{name}</div>
          <div className="text-[#B1B5B4] text-[14px]">{size}</div>
        </div>
      </div>

      <Trash2
        size={22}
        className="cursor-pointer text-[#7A7E83] transition-colors hover:text-red-400"
        onClick={onDelete}
      />
    </div>
  )
}
