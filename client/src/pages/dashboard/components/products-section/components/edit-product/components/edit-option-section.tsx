import { useMutation } from '@apollo/client'
import { Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dropzone } from '@/components/ui/dropzone'
import { Input } from '@/components/ui/input'
import { UPLOAD_FILE } from '@/graphql/upload-file'
import { useProductStore } from '@/store/create-product-store'
import type { ProductOptionType } from '@/types'
import { Image } from '@unpic/react'

export function EditOptionSection({ options: initialOptions }: { options: ProductOptionType[] }) {
  const [uploadImage] = useMutation(UPLOAD_FILE)
  const options = useProductStore((state) => state.product.productOptions)
  const setProduct = useProductStore((state) => state.setProduct)
  const addOption = useProductStore((state) => state.addOption)

  const [loadingImageIndexes, setLoadingImageIndexes] = useState<number[]>([])

  useEffect(() => {
    if (initialOptions?.length) {
      const options = initialOptions.map((opt) => ({
        image_url: opt.image_url,
        name: opt.name,
        value: opt.value,
        type: opt.type,
      }))
      setProduct({ productOptions: options })
    }
  }, [initialOptions, setProduct])

  const handleOptionChange = (index: number, key: keyof ProductOptionType, value: string | null) => {
    const updated = [...options]
    updated[index] = {
      ...updated[index],
      [key]: value ?? '',
    }
    setProduct({ productOptions: updated })
  }

  const handleAddOption = () => {
    addOption({ name: '', type: 'link', value: '', image_url: '', linked_product_id: '' })
  }

  const handleRemoveOption = (index: number) => {
    const updated = options.filter((_, i) => i !== index)
    setProduct({ productOptions: updated })
  }

  const handleImageDrop = async (files: File[], index: number) => {
    if (!files.length) return

    setLoadingImageIndexes((prev) => [...prev, index])

    try {
      const { data } = await uploadImage({ variables: { file: files[0] } })
      if (data?.uploadImage?.url) {
        handleOptionChange(index, 'image_url', data.uploadImage.url)
      }
    } catch (err) {
      console.error('Upload failed', err)
    } finally {
      setLoadingImageIndexes((prev) => prev.filter((i) => i !== index))
    }
  }

  const isLoading = (index: number) => loadingImageIndexes.includes(index)

  return (
    <div>
      <div className="mb-5 flex items-center justify-between max-md:flex-col">
        <h3 className="font-semibold text-lg">Product Options</h3>
      </div>

      {options.map((option, index) => (
        <div key={index} className="mb-3 space-y-3 rounded-lg border border-[#E2E5F1] p-4">
          <Input
            labelContent="Option Name"
            placeholder="e.g. Color or Size"
            value={option.name}
            onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <Input
              labelContent="Value"
              placeholder="Enter value (e.g. Red, Large)"
              value={option.value ?? ''}
              onChange={(e) => handleOptionChange(index, 'value', e.target.value)}
            />
            <Input
              labelContent="Link"
              placeholder="Enter link (e.g. /product/123)"
              value={option.linked_product_id ?? ''}
              onChange={(e) => handleOptionChange(index, 'linked_product_id', e.target.value)}
            />

            <div className="mt-3">
              <label className="text-sm">Upload Image</label>
              <Dropzone accept="image/*" onFilesDrop={(files) => handleImageDrop(files, index)} />
            </div>

            {option.image_url && (
              <div
                onClick={() => handleOptionChange(index, 'image_url', '')}
                className="group relative mt-2 h-fit w-fit cursor-pointer">
                <div className="absolute top-0 left-0 flex h-full w-20 items-center justify-center rounded transition-colors group-hover:bg-[#ffa2a29e]">
                  <X
                    size={30}
                    className="scale-50 text-red-500 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                    fill="#fb2c36"
                  />
                </div>
                <Image
                  src={option.image_url}
                  alt="Option preview"
                  width={80}
                  height={80}
                  layout="constrained"
                  className={`w-20 rounded object-fill ${isLoading(index) ? 'opacity-50 grayscale' : ''}`}
                />
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={() => handleRemoveOption(index)}
            className="flex h-[40px] items-center justify-center gap-1 bg-red-500 hover:bg-red-600 max-md:w-full">
            <Trash2 size={20} />
            Remove
          </Button>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAddOption}
        className="flex h-[40px] w-full max-w-[220px] items-center justify-center gap-1 max-md:mt-3 max-md:w-full">
        <Plus className="h-4 w-4" />
        Add Option
      </Button>
    </div>
  )
}
