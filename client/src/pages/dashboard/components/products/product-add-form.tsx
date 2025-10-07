import { useState } from "react"
import { Edit, Save, X, Upload, Plus } from "lucide-react"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"
import { Badge } from "../ui/badge"
import { useMutation } from "@apollo/client"
import { CREATE_PRODUCT_WITH_VARIANTS } from "@/graphql/product"
import { UPLOAD_FILE } from "@/graphql/upload-file"
import { toast } from "sonner"

interface ProductAddFormProps {
  onClose: () => void
  onSave: () => void
}

type Variant = { sku: string; options: { name: string; value: string }[]; price?: number; stock?: number; image_url?: string }

type SaveState = 'idle' | 'uploading_images' | 'saving_product'

export function ProductAddForm({ onClose, onSave }: ProductAddFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
    category: "",
    subcategory: "",
    status: "Active",
    description: "",
  })

  const [specName, setSpecName] = useState("")
  const [specValue, setSpecValue] = useState("")
  const [specifications, setSpecifications] = useState<{ spec_name: string; spec_value: string }[]>([])
  const [optionGroupName, setOptionGroupName] = useState("")
  const [optionValue, setOptionValue] = useState("")
  const [optionGroups, setOptionGroups] = useState<{ name: string; values: string[] }[]>([])
  const [variants, setVariants] = useState<Variant[]>([])

  const [createProductWithVariants, { loading: isSavingMutation }] = useMutation(CREATE_PRODUCT_WITH_VARIANTS)
  const [uploadFile] = useMutation(UPLOAD_FILE)

  // Product images (main and gallery)
  const [productImageFiles, setProductImageFiles] = useState<File[]>([])
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const handleProductImagesChange = (files: FileList | null) => {
    if (!files) return
    setProductImageFiles(Array.from(files))
  }

  const addSpecification = () => {
    if (!specName.trim() || !specValue.trim()) return
    setSpecifications((prev) => [...prev, { spec_name: specName.trim(), spec_value: specValue.trim() }])
    setSpecName("")
    setSpecValue("")
  }

  const removeSpecification = (idx: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== idx))
  }

  const addOptionGroup = () => {
    if (!optionGroupName.trim() || !optionValue.trim()) return
    setOptionGroups((prev) => {
      const existing = prev.find((g) => g.name === optionGroupName.trim())
      if (existing) {
        if (!existing.values.includes(optionValue.trim())) {
          return prev.map((g) => (g.name === existing.name ? { ...g, values: [...g.values, optionValue.trim()] } : g))
        }
        return prev
      }
      return [...prev, { name: optionGroupName.trim(), values: [optionValue.trim()] }]
    })
    setOptionValue("")
  }

  const removeOptionValue = (groupName: string, value: string) => {
    setOptionGroups((prev) => prev.map((g) => (g.name === groupName ? { ...g, values: g.values.filter((v) => v !== value) } : g)))
  }

  const removeOptionGroup = (groupName: string) => {
    setOptionGroups((prev) => prev.filter((g) => g.name !== groupName))
  }

  const generateCombinations = (groups: { name: string; values: string[] }[]) => {
    let combos: { name: string; value: string }[][] = [[]]
    for (const group of groups) {
      const next: { name: string; value: string }[][] = []
      for (const combo of combos) {
        for (const v of group.values) {
          next.push([...combo, { name: group.name, value: v }])
        }
      }
      combos = next
    }
    const baseSku = formData.name ? formData.name.replace(/\s+/g, "-").toUpperCase() : "SKU"
    const res = combos.map((options, idx) => ({
      sku: `${baseSku}-${idx + 1}`,
      options,
      price: Number(formData.price) || undefined,
      stock: Number(formData.stock) || undefined,
    }))
    setVariants(res)
  }

  const handleVariantChange = (index: number, patch: Partial<Variant>) => {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)))
  }

  const handleVariantImageUpload = async (index: number, file: File) => {
    const { data } = await uploadFile({ variables: { file } })
    const url = data?.uploadImage?.url as string | undefined
    if (url) handleVariantChange(index, { image_url: url })
  }

  const handleSave = async () => {
    try {
      // Basic validation
      if (!formData.name || !formData.price) {
        toast.error("Please provide at least name and price")
        return
      }

      setSaveState('uploading_images')

      // Upload product-level images in parallel, if any
      const uploadedUrls: (string | null)[] = await Promise.all(
        productImageFiles.map(async (file) => {
          try {
            const { data } = await uploadFile({ variables: { file } })
            return (data?.uploadImage?.url as string) ?? null
          } catch (e) {
            console.error("Image upload failed", e)
            return null
          }
        })
      )

      const images = uploadedUrls
        .filter((u): u is string => Boolean(u))
        .map((url, idx) => ({ image_url: url, is_primary: idx === 0 }))

      setSaveState('saving_product')

      const variables = {
        name: formData.name,
        price: Number(formData.price),
        currency: "USD",
        product_overview: formData.description,
        category_id: formData.category || undefined,
        is_returnable: true,
        images,
        specifications,
        options: optionGroups.map((g) => ({ name: g.name, values: g.values })),
        variants: variants.map((v) => ({
          sku: v.sku,
          options: v.options,
          price: typeof v.price === "number" ? v.price : undefined,
          stock: typeof v.stock === "number" ? v.stock : undefined,
          image_url: v.image_url || undefined,
        })),
      }

      const { data } = await createProductWithVariants({ variables })
      if (data?.createProductWithVariants?.success) {
        toast.success("Product created successfully")
        onSave()
      } else {
        toast.error(data?.createProductWithVariants?.message || "Failed to create product")
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred while creating the product")
    } finally {
      setSaveState('idle')
    }
  }
  const isBusy = saveState !== 'idle' || isSavingMutation

  return (
    <div className="bg-background rounded-lg">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            New Product
          </CardTitle>
          <Button variant="ghost" onClick={onClose} disabled={isBusy}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Images */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Product Images</Label>
            <div className="w-full h-64 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center mb-4 p-4">
              <div className="text-center mb-3">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Select one or more images. First will be primary.</p>
              </div>
              <input type="file" accept="image/*" multiple onChange={(e) => handleProductImagesChange(e.target.files)} />
              {productImageFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">{productImageFiles.length} image(s) selected</p>
              )}
              {saveState === 'uploading_images' && (
                <p className="text-xs text-muted-foreground mt-1">Uploading images...</p>
              )}
            </div>
          </div>

          {/* Product Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" value={formData.sku} onChange={(e) => setFormData((p) => ({ ...p, sku: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))} />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData((p) => ({ ...p, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select value={formData.subcategory} onValueChange={(value) => setFormData((p) => ({ ...p, subcategory: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Computers">Computers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} rows={3} />
            </div>

            {/* Specifications */}
            <div className="space-y-2">
              <Label>Specifications</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Name (e.g. Material)" value={specName} onChange={(e) => setSpecName(e.target.value)} />
                <Input placeholder="Value (e.g. Cotton)" value={specValue} onChange={(e) => setSpecValue(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addSpecification}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {specifications.map((s, i) => (
                  <Badge key={`${s.spec_name}-${i}`} variant="secondary" className="gap-1">
                    {s.spec_name}: {s.spec_value}
                    <button onClick={() => removeSpecification(i)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Option Groups */}
            <div className="space-y-2">
              <Label>Options</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Option Name (e.g. Color)" value={optionGroupName} onChange={(e) => setOptionGroupName(e.target.value)} />
                <Input placeholder="Add Value (e.g. Red)" value={optionValue} onChange={(e) => setOptionValue(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={addOptionGroup}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateCombinations(optionGroups)}>
                  Generate Variants
                </Button>
              </div>
              <div className="space-y-2">
                {optionGroups.map((g) => (
                  <div key={g.name} className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{g.name}</Badge>
                    {g.values.map((v) => (
                      <Badge key={v} variant="secondary" className="gap-1">
                        {v}
                        <button onClick={() => removeOptionValue(g.name, v)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    <Button size="xs" variant="ghost" onClick={() => removeOptionGroup(g.name)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants Table */}
            {variants.length > 0 && (
              <div className="mt-4 space-y-4">
                <Label>Generated Variants</Label>
                <div className="grid grid-cols-1 gap-2">
                  {variants.map((v, i) => (
                    <div key={i} className="grid grid-cols-6 gap-2 items-center">
                      <Input value={v.sku} onChange={(e) => handleVariantChange(i, { sku: e.target.value })} />
                      <Input type="number" placeholder="Price" value={v.price ?? ''} onChange={(e) => handleVariantChange(i, { price: e.target.value === '' ? undefined : Number(e.target.value) })} />
                      <Input type="number" placeholder="Stock" value={v.stock ?? ''} onChange={(e) => handleVariantChange(i, { stock: e.target.value === '' ? undefined : Number(e.target.value) })} />
                      <Input placeholder="Image URL" value={v.image_url ?? ''} onChange={(e) => handleVariantChange(i, { image_url: e.target.value })} />
                      <div className="flex items-center gap-2">
                        <input type="file" accept="image/*" onChange={(e) => e.target.files && handleVariantImageUpload(i, e.target.files[0])} />
                      </div>
                      <div className="text-sm text-muted-foreground col-span-6">
                        {v.options.map((o) => `${o.name}: ${o.value}`).join(' / ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1" disabled={isBusy}>
                <Save className="h-4 w-4 mr-2" />
                {isBusy ? (saveState === 'uploading_images' ? 'Uploading images...' : 'Saving...') : 'Create Product'}
              </Button>
              <Button variant="outline" onClick={onClose} disabled={isBusy}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  )
}
