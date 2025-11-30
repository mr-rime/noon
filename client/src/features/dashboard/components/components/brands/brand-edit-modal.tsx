import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { X, Upload, Loader2 } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Switch } from "../../components/ui/switch"
import { CREATE_BRAND, UPDATE_BRAND } from "@/features/category/api/brand"
import { toast } from "sonner"

interface Brand {
    brand_id: number
    name: string
    slug: string
    description?: string
    logo_url?: string
    is_active: boolean
}

interface BrandEditModalProps {
    brand?: Brand | null
    isCreating?: boolean
    onClose: () => void
    onSave: () => void
}

export function BrandEditModal({ brand, isCreating, onClose, onSave }: BrandEditModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        logo_url: "",
        is_active: true
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [createBrand, { loading: creating }] = useMutation(CREATE_BRAND)
    const [updateBrand, { loading: updating }] = useMutation(UPDATE_BRAND)

    const isLoading = creating || updating

    useEffect(() => {
        if (brand) {
            setFormData({
                name: brand.name || "",
                slug: brand.slug || "",
                description: brand.description || "",
                logo_url: brand.logo_url || "",
                is_active: brand.is_active ?? true
            })
        } else {
            setFormData({
                name: "",
                slug: "",
                description: "",
                logo_url: "",
                is_active: true
            })
        }
    }, [brand])

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setFormData(prev => ({
            ...prev,
            name,
            slug: isCreating ? generateSlug(name) : prev.slug
        }))
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Brand name is required"
        }

        if (!formData.slug.trim()) {
            newErrors.slug = "Brand slug is required"
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = "Slug must contain only lowercase letters, numbers, and hyphens"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            const input = {
                name: formData.name.trim(),
                slug: formData.slug.trim(),
                description: formData.description.trim() || null,
                logo_url: formData.logo_url.trim() || null,
                is_active: formData.is_active
            }

            if (isCreating) {
                const result = await createBrand({
                    variables: { input }
                })

                if (result.data?.createBrand?.success) {
                    toast.success("Brand created successfully")
                    onSave()
                } else {
                    toast.error(result.data?.createBrand?.message || "Failed to create brand")
                }
            } else if (brand) {
                const result = await updateBrand({
                    variables: {
                        id: brand.brand_id,
                        input
                    }
                })

                if (result.data?.updateBrand?.success) {
                    toast.success("Brand updated successfully")
                    onSave()
                } else {
                    toast.error(result.data?.updateBrand?.message || "Failed to update brand")
                }
            }
        } catch (error) {
            console.error("Error saving brand:", error)
            toast.error("An error occurred while saving the brand")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl">
                <div className="sticky top-0 z-10 bg-background border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            {isCreating ? "Create New Brand" : "Edit Brand"}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Brand Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={handleNameChange}
                            placeholder="Enter brand name"
                            disabled={isLoading}
                            className={errors.name ? "border-destructive" : ""}
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Brand Slug <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            placeholder="brand-slug"
                            disabled={isLoading}
                            className={errors.slug ? "border-destructive" : ""}
                        />
                        {errors.slug && (
                            <p className="text-sm text-destructive">{errors.slug}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            The URL-friendly version of the brand name
                        </p>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="logo_url">Logo URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="logo_url"
                                value={formData.logo_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                                placeholder="https://example.com/logo.png"
                                disabled={isLoading}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                disabled={isLoading}
                                onClick={() => {
                                    toast.info("File upload coming soon")
                                }}
                            >
                                <Upload className="h-4 w-4" />
                            </Button>
                        </div>
                        {formData.logo_url && (
                            <div className="mt-2 p-4 border rounded-lg">
                                <img
                                    src={formData.logo_url}
                                    alt="Brand logo preview"
                                    className="h-20 w-auto object-contain"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter brand description"
                            rows={4}
                            disabled={isLoading}
                        />
                    </div>


                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="is_active">Active Status</Label>
                            <p className="text-sm text-muted-foreground">
                                Set whether this brand is active and visible
                            </p>
                        </div>
                        <Switch
                            id="is_active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="admin"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isCreating ? "Create Brand" : "Update Brand"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
