import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "@/features/category/api/category"
import { toast } from 'sonner'
import { Switch } from '../ui/switch'

interface CategoryEditModalProps {
    category?: any
    parentCategory?: any
    isCreating?: boolean
    onClose: () => void
    onSave: () => void
}

export function CategoryEditModal({ category, parentCategory, isCreating, onClose, onSave }: CategoryEditModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        is_active: true,
        parent_id: null as number | null
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                description: category.description || '',
                is_active: category.is_active !== false,
                parent_id: category.parent_id || null
            })
        } else if (parentCategory && isCreating) {

            setFormData(prev => ({
                ...prev,
                parent_id: parentCategory.category_id
            }))
        }
    }, [category, parentCategory, isCreating])

    const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY, {
        onCompleted: (data) => {
            if (data.createCategory.success) {
                toast.success('Category created successfully')
                onSave()
            } else {
                toast.error(data.createCategory.message || 'Failed to create category')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to create category')
        }
    })

    const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY, {
        onCompleted: (data) => {
            if (data.updateCategory.success) {
                toast.success('Category updated successfully')
                onSave()
            } else {
                toast.error(data.updateCategory.message || 'Failed to update category')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update category')
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
            newErrors.name = 'Category name is required'
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
            name: formData.name.trim(),
            slug: formData.slug.trim(),
            description: formData.description.trim() || null,
            is_active: formData.is_active,
            parent_id: formData.parent_id
        }

        if (isCreating) {
            await createCategory({ variables: { input } })
        } else if (category) {
            await updateCategory({ variables: { id: category.category_id, input } })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">

                <div className="border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {isCreating
                            ? (parentCategory ? `Create Subcategory under "${parentCategory.name}"` : 'Create Category')
                            : 'Edit Category'
                        }
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


                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Category Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="e.g., Electronics"
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
                                placeholder="e.g., electronics"
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
                                placeholder="Brief description of this category..."
                                rows={3}
                                disabled={loading}
                            />
                        </div>


                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="is_active">Active Status</Label>
                                <p className="text-xs text-muted-foreground">
                                    Inactive categories won't be visible to customers
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
                            {loading ? 'Saving...' : isCreating ? 'Create Category' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
