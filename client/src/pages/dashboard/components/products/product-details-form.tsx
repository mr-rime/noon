import { useState, useEffect, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Save, X, Plus } from 'lucide-react'
import { UPDATE_PRODUCT } from '@/graphql/product'
import { ProductImageManager, type ProductImageManagerRef } from '@/components/product-image-manager'
import { useDebounce } from '@/hooks/use-debounce'
import type { ProductType, ProductImage, ProductSpecification } from '@/types'
import { useRef } from 'react'

interface ProductDetailsFormProps {
    product: ProductType
    onUpdate?: (product: ProductType) => void
}

export function ProductDetailsForm({ product, onUpdate }: ProductDetailsFormProps) {
    const [formData, setFormData] = useState({
        name: product.name || '',
        price: product.price || 0,
        currency: product.currency || 'USD',
        stock: product.stock || 0,
        product_overview: product.product_overview || '',
        is_returnable: product.is_returnable || false,
        is_public: product.is_public || false
    })


    const extractKeyFromUrl = (url: string): string | undefined => {
        console.log('Extracting key from URL:', url)
        if (url.includes('utfs.io/f/')) {
            const match = url.match(/utfs\.io\/f\/([^/]+)/)
            const key = match ? match[1] : undefined
            console.log('Match result:', match, 'Extracted key:', key)
            return key
        }
        console.log('URL does not contain utfs.io/f/')
        return undefined
    }

    const [images, setImages] = useState<ProductImage[]>(
        (product.images || []).map(img => {
            const extractedKey = extractKeyFromUrl(img.image_url)
            console.log('Processing image:', img.image_url, 'Extracted key:', extractedKey)
            return {
                ...img,
                key: extractedKey
            }
        })
    )

    const [specifications, setSpecifications] = useState<ProductSpecification[]>(product.productSpecifications || [])
    const [newSpec, setNewSpec] = useState({ spec_name: '', spec_value: '' })

    const [saving, setSaving] = useState(false)
    const [draftSaved, setDraftSaved] = useState(false)


    const draftKey = `product-draft-${product.id}`


    const saveDraft = useCallback(() => {
        const draftData = {
            formData,
            specifications,
            timestamp: Date.now()
        }
        localStorage.setItem(draftKey, JSON.stringify(draftData))
        setDraftSaved(true)
        setTimeout(() => setDraftSaved(false), 2000)
    }, [formData, specifications, draftKey])


    const loadDraft = useCallback(() => {
        try {
            const savedDraft = localStorage.getItem(draftKey)
            if (savedDraft) {
                const draftData = JSON.parse(savedDraft)
                setFormData(draftData.formData)
                setSpecifications(draftData.specifications)
                return true
            }
        } catch (error) {
            console.error('Error loading draft:', error)
        }
        return false
    }, [draftKey])


    const clearDraft = () => {
        localStorage.removeItem(draftKey)
    }

    const [updateProduct] = useMutation(UPDATE_PRODUCT)
    const imageManagerRef = useRef<ProductImageManagerRef>(null)



    const handleImagesChange = (newImages: ProductImage[]) => {
        setImages(newImages)
    }


    const debouncedSaveDraft = useDebounce(saveDraft, 1000)

    useEffect(() => {

        const hasDraft = loadDraft()

        if (!hasDraft) {
            const validCurrency = product.currency && product.currency.length >= 3
                ? product.currency
                : 'USD'

            setFormData({
                name: product.name || '',
                price: product.price || 0,
                currency: validCurrency,
                stock: product.stock || 0,
                product_overview: product.product_overview || '',
                is_returnable: product.is_returnable || false,
                is_public: product.is_public || false
            })
            setImages(product.images || [])
            setSpecifications(product.productSpecifications || [])
        }
    }, [product, loadDraft])

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }


    useEffect(() => {
        debouncedSaveDraft()
    }, [formData, specifications, debouncedSaveDraft])









    const addSpecification = () => {
        if (newSpec.spec_name && newSpec.spec_value) {
            const newSpecification: ProductSpecification = {
                id: Date.now().toString(),
                product_id: product.id,
                spec_name: newSpec.spec_name,
                spec_value: newSpec.spec_value
            }
            setSpecifications(prev => [...prev, newSpecification])
            setNewSpec({ spec_name: '', spec_value: '' })
        }
    }

    const removeSpecification = (specId: string) => {
        setSpecifications(prev => prev.filter(spec => spec.id !== specId))
    }



    const handleSave = async () => {
        setSaving(true)
        try {

            let uploadedImages: ProductImage[] = []
            if (imageManagerRef.current) {
                try {
                    uploadedImages = await imageManagerRef.current.uploadFiles()
                    if (uploadedImages.length > 0) {

                        const newImages = [...images, ...uploadedImages]
                        setImages(newImages)
                        toast.success(`${uploadedImages.length} image(s) uploaded successfully`)
                    }
                } catch (error) {
                    console.error('Image upload failed:', error)
                    toast.error('Failed to upload images')
                    setSaving(false)
                    return
                }
            }


            const allImages = [...images, ...uploadedImages]
            const { data } = await updateProduct({
                variables: {
                    id: product.id,
                    ...formData,
                    images: allImages.map(img => ({
                        image_url: img.image_url,
                        is_primary: img.is_primary
                    })),
                    productSpecifications: specifications.map(spec => ({
                        spec_name: spec.spec_name,
                        spec_value: spec.spec_value
                    }))
                }
            })

            if (data?.updateProduct?.success) {
                toast.success('Product updated successfully!')
                onUpdate?.(data.updateProduct.product)
                clearDraft()
            } else {
                toast.error(data?.updateProduct?.message || 'Failed to update product')
            }
        } catch (error) {
            console.error('Error updating product:', error)
            toast.error('An error occurred while updating the product')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6 bg-gray-50 p-4 rounded-lg border">

            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">PSKU: {product.psku}</Badge>
                        {product.category_name && (
                            <Badge variant="secondary">{product.category_name}</Badge>
                        )}
                        {product.brand_name && (
                            <Badge variant="secondary">{product.brand_name}</Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {draftSaved && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Draft saved
                        </div>
                    )}

                    <div className="flex items-center gap-3 px-4 py-2 bg-white border rounded-lg">
                        <Switch
                            checked={formData.is_public}
                            onChange={(e) => handleInputChange('is_public', e.target.checked)}
                            name="is_public"
                        />
                        <span className="text-sm font-medium">
                            {formData.is_public ? (
                                <span className="text-green-600">Public (Visible to customers)</span>
                            ) : (
                                <span className="text-orange-600">Private (Dashboard only)</span>
                            )}
                        </span>
                    </div>
                    <Button
                        variant="outline"
                        onClick={saveDraft}
                        className="mr-2"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                            <>
                                <Save className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2 space-y-6">

                    <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter product name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                                        placeholder="0.00"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium mb-1">Currency</label>
                                    <select
                                        id="currency"
                                        value={formData.currency}
                                        onChange={(e) => handleInputChange('currency', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                        <option value="AED">AED - UAE Dirham</option>
                                        <option value="EGP">EGP - Egyptian Pound</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium mb-1">Stock</label>
                                    <input
                                        id="stock"
                                        type="number"
                                        value={formData.stock}
                                        onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="overview" className="block text-sm font-medium mb-1">Product Overview</label>
                                <textarea
                                    id="overview"
                                    value={formData.product_overview}
                                    onChange={(e) => handleInputChange('product_overview', e.target.value)}
                                    placeholder="Describe your product..."
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>


                            <div className="pt-4 border-t">
                                <h4 className="text-sm font-medium mb-3 text-gray-700">Product Settings</h4>
                                <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                                    <Switch
                                        checked={formData.is_returnable}
                                        onChange={(e) => handleInputChange('is_returnable', e.target.checked)}
                                        name="is_returnable"
                                    />
                                    <span className="text-sm">This product is returnable</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Product Images (Max 4)</h3>

                        <ProductImageManager
                            ref={imageManagerRef}
                            images={images}
                            onImagesChange={handleImagesChange}
                            maxImages={4}
                            disabled={saving}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border rounded-lg p-6">
                        <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium mb-1">PSKU</label>
                                <p className="text-sm text-muted-foreground font-mono">{product.psku}</p>
                            </div>

                            {product.category_name && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <p className="text-sm text-muted-foreground">{product.category_name}</p>
                                </div>
                            )}

                            {product.subcategory_name && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Subcategory</label>
                                    <p className="text-sm text-muted-foreground">{product.subcategory_name}</p>
                                </div>
                            )}

                            {product.brand_name && (
                                <div>
                                    <label className="block text-sm font-medium mb-1">Brand</label>
                                    <p className="text-sm text-muted-foreground">{product.brand_name}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium mb-1">Created</label>
                                <p className="text-sm text-muted-foreground">
                                    {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Last Updated</label>
                                <p className="text-sm text-muted-foreground">
                                    {product.updated_at ? new Date(product.updated_at).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Specification name"
                                value={newSpec.spec_name}
                                onChange={(e) => setNewSpec(prev => ({ ...prev, spec_name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                placeholder="Specification value"
                                value={newSpec.spec_value}
                                onChange={(e) => setNewSpec(prev => ({ ...prev, spec_value: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <Button
                                onClick={addSpecification}
                                disabled={!newSpec.spec_name || !newSpec.spec_value}
                                className="w-full"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {specifications.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No specifications added yet.</p>
                                <p className="text-sm">Add product specifications to help customers understand your product better.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {specifications.map((spec) => (
                                    <div key={spec.id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                        <div className="flex-1">
                                            <span className="font-medium text-gray-900">{spec.spec_name}:</span>
                                            <span className="ml-2 text-gray-600">{spec.spec_value}</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => removeSpecification(spec.id || '')}
                                            title="Remove specification"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}