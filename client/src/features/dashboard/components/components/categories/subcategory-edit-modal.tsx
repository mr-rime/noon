import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { CREATE_SUBCATEGORY, UPDATE_SUBCATEGORY } from "@/features/category/api/category"
import { toast } from 'sonner'
import { Switch } from '../ui/switch'

interface SubcategoryEditModalProps {
    subcategory?: any
    parentCategory: any
    onClose: () => void
    onSave: () => void
}

export function SubcategoryEditModal({ subcategory, parentCategory, onClose, onSave }: SubcategoryEditModalProps) {
    const isCreating = !subcategory
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        is_active: true
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (subcategory) {
            setFormData({
                name: subcategory.name || '',
                slug: subcategory.slug || '',
                description: subcategory.description || '',
                is_active: subcategory.is_active !== false
            })
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                is_active: true
            })
        }
    }, [subcategory])

    const [createSubcategory, { loading: creating }] = useMutation(CREATE_SUBCATEGORY, {
        onCompleted: (data) => {
            if (data.createSubcategory.success) {
                toast.success('Subcategory created successfully')
                onSave()
            } else {
                toast.error(data.createSubcategory.message || 'Failed to create subcategory')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create subcategory')
        }
    })

    const [updateSubcategory, { loading: updating }] = useMutation(UPDATE_SUBCATEGORY, {
        onCompleted: (data) => {
            if (data.updateSubcategory.success) {
                toast.success('Subcategory updated successfully')
                onSave()
            } else {
                toast.error(data.updateSubcategory.message || 'Failed to update subcategory')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update subcategory')
        }
    })

    const loading = creating || updating

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '')
    }

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }))
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Subcategory name is required'
        }

        if (!formData.slug.trim()) {
            newErrors.slug = 'Slug is required'
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const input = {
            category_id: parentCategory.category_id,
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            description: formData.description.trim() || null,
            is_active: formData.is_active
        }

        if (isCreating) {
            await createSubcategory({ variables: { input } })
        } else {
            await updateSubcategory({ variables: { id: subcategory.subcategory_id, input } })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">

                <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">
                            {isCreating ? 'Create Subcategory' : 'Edit Subcategory'}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            disabled={loading}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Parent Category: <span className="font-medium text-foreground">{parentCategory.name}</span>
                    </p>
                </div>


                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Subcategory Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., Smartphones"
                                disabled={loading}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                URL Slug <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                placeholder="e.g., smartphones"
                                disabled={loading}
                                className={errors.slug ? 'border-red-500' : ''}
                            />
                            {errors.slug && (
                                <p className="text-sm text-red-500">{errors.slug}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                The URL-friendly version of the name (auto-generated)
                            </p>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Brief description of this subcategory..."
                                rows={3}
                                disabled={loading}
                            />
                        </div>


                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="is_active">Active Status</Label>
                                <p className="text-xs text-muted-foreground">
                                    Inactive subcategories won't be visible to customers
                                </p>
                            </div>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, is_active: checked }))}
                                disabled={loading}
                            />
                        </div>
                    </div>


                    <div className="border-t px-6 py-4 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="admin"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : isCreating ? 'Create Subcategory' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
