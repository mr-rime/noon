import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useProductStore } from '@/store/create-product-store'

export function AddSpecSection() {
  const { product, setProduct, addSpecification } = useProductStore()

  const specs = product.productSpecifications

  const handleSpecChange = (index: number, key: keyof (typeof specs)[number], value: string) => {
    const updatedSpecs = [...specs]
    updatedSpecs[index] = { ...updatedSpecs[index], [key]: value }
    setProduct({ productSpecifications: updatedSpecs })
  }

  const handleAddSpec = () => {
    addSpecification({ spec_name: '', spec_value: '' })
  }

  const handleRemoveSpec = (index: number) => {
    const updatedSpecs = specs.filter((_, i) => i !== index)
    setProduct({ productSpecifications: updatedSpecs })
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between max-md:flex-col">
        <h3 className="font-semibold text-lg">Product Specifications</h3>
      </div>

      {specs.map((spec, index) => (
        <div key={index} className="mb-3 space-y-3 rounded-lg border border-[#E2E5F1] p-4">
          <Input
            labelContent="Specification Name"
            placeholder="e.g. RAM, Storage"
            value={spec.spec_name}
            onChange={(e) => handleSpecChange(index, 'spec_name', e.target.value)}
          />
          <Input
            labelContent="Specification Value"
            placeholder="e.g. 8GB, 128GB"
            value={spec.spec_value}
            onChange={(e) => handleSpecChange(index, 'spec_value', e.target.value)}
          />

          <Button
            type="button"
            onClick={() => handleRemoveSpec(index)}
            className="flex h-[40px] items-center justify-center gap-1 bg-red-500 hover:bg-red-600 max-md:w-full">
            <Trash2 size={20} />
            Remove
          </Button>
        </div>
      ))}
      <Button
        type="button"
        onClick={handleAddSpec}
        className="flex h-[40px] w-full max-w-[220px] items-center justify-center gap-1 max-md:mt-3 max-md:w-full">
        <Plus className="h-4 w-4" />
        Add Specification
      </Button>
    </div>
  )
}
