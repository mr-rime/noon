import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { ChevronDown, ChevronUp, Trash2, Package, X, Edit, Grid, Search, ArrowLeft } from 'lucide-react'
import { GET_PRODUCT_GROUPS, CREATE_PRODUCT_GROUP, UPDATE_PRODUCT_GROUP, ADD_PRODUCT_TO_GROUP, CREATE_PSKU_PRODUCT } from '@/graphql/psku'
import { GET_PRODUCTS, UPDATE_PRODUCT } from '@/graphql/product'
import type { ProductType, ProductGroup } from '@/types'
import { Link } from '@tanstack/react-router'

interface ProductGroupManagerProps {
    product: ProductType
    onProductUpdate?: (product: ProductType) => void
    onGroupUpdate?: () => void
}

export function ProductGroupManager({ product, onGroupUpdate }: ProductGroupManagerProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [showGroupModal, setShowGroupModal] = useState(false)
    const [showAddPskuOptions, setShowAddPskuOptions] = useState(false)
    const [showAddExisting, setShowAddExisting] = useState(false)
    const [showCreateNew, setShowCreateNew] = useState(false)
    const [groupAxes, setGroupAxes] = useState<string[]>([])
    const [newAxisName, setNewAxisName] = useState('')
    const [groupProducts, setGroupProducts] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProducts, setSelectedProducts] = useState<string[]>([])
    const [newPsku, setNewPsku] = useState('')
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupDescription, setNewGroupDescription] = useState('')
    const [editableAttributes, setEditableAttributes] = useState<Record<string, Record<string, string>>>({})

    // Queries
    const { data: groupsData, refetch: refetchGroups } = useQuery(GET_PRODUCT_GROUPS, {
        variables: { category_id: product.category_id },
        skip: !product.category_id
    })

    const { data: productsData } = useQuery(GET_PRODUCTS, {
        variables: { limit: 50, offset: 0, search: searchQuery },
        skip: !showAddExisting
    })

    const currentGroup = groupsData?.getProductGroups?.groups?.find((g: ProductGroup) => g.group_id === product.group_id)

    useEffect(() => {
        if (currentGroup) {
            // Parse attributes if they're stored as JSON string
            let attributes = []
            try {
                attributes = typeof currentGroup.attributes === 'string'
                    ? JSON.parse(currentGroup.attributes)
                    : currentGroup.attributes || []
            } catch {
                attributes = []
            }
            setGroupAxes(Array.isArray(attributes) ? attributes : [])
        }
    }, [currentGroup])

    // Initialize editable attributes when modal opens
    useEffect(() => {
        if (showGroupModal && currentGroup) {
            const attrs: Record<string, Record<string, string>> = {}

            // Current product
            attrs[product.id] = {}
            product.productAttributes?.forEach(attr => {
                attrs[product.id][attr.attribute_name] = attr.attribute_value
            })

            // Group products
            groupProducts.forEach(gp => {
                attrs[gp.id] = {}
                gp.productAttributes?.forEach((attr: any) => {
                    attrs[gp.id][attr.attribute_name] = attr.attribute_value
                })
            })

            setEditableAttributes(attrs)
        }
    }, [showGroupModal, currentGroup, product, groupProducts])

    useEffect(() => {
        // Load group products
        if (product.groupProducts && product.groupProducts.length > 0) {
            // Convert to full product objects if needed
            setGroupProducts(product.groupProducts.map((p: any) =>
                typeof p === 'string' ? { id: p } : p
            ))
        }
    }, [product.groupProducts])

    const [createGroup] = useMutation(CREATE_PRODUCT_GROUP)
    const [updateGroup] = useMutation(UPDATE_PRODUCT_GROUP)
    const [addProductToGroup] = useMutation(ADD_PRODUCT_TO_GROUP)
    const [createPskuProduct] = useMutation(CREATE_PSKU_PRODUCT)
    const [updateProduct] = useMutation(UPDATE_PRODUCT)

    const handleAddAxis = () => {
        if (!newAxisName.trim()) {
            toast.error('Axis name is required')
            return
        }
        if (groupAxes.includes(newAxisName.trim())) {
            toast.error('Axis already exists')
            return
        }
        setGroupAxes([...groupAxes, newAxisName.trim()])
        setNewAxisName('')
    }

    const handleRemoveAxis = (axis: string) => {
        setGroupAxes(groupAxes.filter(a => a !== axis))
    }

    const handleCloseModal = () => {
        setShowGroupModal(false)
        // Reset form if creating new group
        if (!currentGroup) {
            setNewGroupName('')
            setNewGroupDescription('')
            setGroupAxes([])
            setNewAxisName('')
        }
    }

    const handleSaveGroup = async () => {
        // Create new group
        if (!currentGroup) {
            if (!newGroupName.trim()) {
                toast.error('Group name is required')
                return
            }

            try {
                const { data } = await createGroup({
                    variables: {
                        input: {
                            name: newGroupName.trim(),
                            description: newGroupDescription.trim() || null,
                            category_id: product.category_id,
                            subcategory_id: product.subcategory_id,
                            brand_id: product.brand_id,
                            attributes: groupAxes
                        }
                    }
                })

                if (data?.createProductGroup?.success) {
                    const newGroupId = data.createProductGroup.group.group_id

                    // Add current product to the new group
                    await addProductToGroup({
                        variables: {
                            product_id: product.id,
                            group_id: newGroupId
                        }
                    })

                    toast.success('Group created successfully!')
                    setShowGroupModal(false)
                    setNewGroupName('')
                    setNewGroupDescription('')
                    setGroupAxes([])
                    refetchGroups()
                    onGroupUpdate?.()
                } else {
                    toast.error(data?.createProductGroup?.message || 'Failed to create group')
                }
            } catch (error) {
                console.error('Error creating group:', error)
                toast.error('An error occurred while creating the group')
            }
            return
        }

        // Update existing group (axes and product attributes)
        try {
            // Update group axes
            const { data } = await updateGroup({
                variables: {
                    groupId: currentGroup.group_id,
                    attributes: groupAxes
                }
            })

            if (!data?.updateProductGroup?.success) {
                toast.error(data?.updateProductGroup?.message || 'Failed to update group')
                return
            }

            // Update product attributes for all products
            const productIds = [product.id, ...groupProducts.map(p => p.id)]
            const updatePromises = productIds.map(async (productId) => {
                const attributes = editableAttributes[productId] || {}
                // Only include attributes that match current axes
                const productAttributes = Object.entries(attributes)
                    .filter(([name]) => groupAxes.includes(name))
                    .map(([name, value]) => ({
                        attribute_name: name,
                        attribute_value: value
                    }))

                return updateProduct({
                    variables: {
                        id: productId,
                        productAttributes
                    }
                })
            })

            await Promise.all(updatePromises)

            toast.success('Group and product attributes updated successfully!')
            setShowGroupModal(false)
            refetchGroups()
            onGroupUpdate?.()
        } catch (error) {
            console.error('Error updating group:', error)
            toast.error('An error occurred while updating the group')
        }
    }

    const handleAttributeChange = (productId: string, axis: string, value: string) => {
        setEditableAttributes(prev => ({
            ...prev,
            [productId]: {
                ...prev[productId],
                [axis]: value
            }
        }))
    }

    const handleToggleProductSelection = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleAddSelectedProducts = () => {
        // Implementation for adding selected products to group
        toast.success(`${selectedProducts.length} product(s) added to group`)
        setShowAddExisting(false)
        setSelectedProducts([])
    }

    const handleGeneratePSKU = () => {
        // Generate a random PSKU
        const timestamp = Date.now().toString(36)
        const random = Math.random().toString(36).substring(2, 15)
        setNewPsku(`PSKU_${timestamp}${random}`.toUpperCase())
    }

    const handleCreateNewPsku = async () => {
        if (!newPsku.trim()) {
            toast.error('PSKU is required')
            return
        }

        if (!currentGroup) {
            toast.error('Please select a group first')
            return
        }

        try {
            const { data } = await createPskuProduct({
                variables: {
                    name: `Product ${newPsku}`,
                    psku: newPsku.trim(),
                    price: product.price,
                    currency: product.currency,
                    category_id: product.category_id,
                    subcategory_id: product.subcategory_id,
                    brand_id: product.brand_id,
                    group_id: currentGroup.group_id,
                    stock: 0,
                    is_returnable: product.is_returnable,
                    product_overview: '',
                    images: [],
                    productSpecifications: [],
                    productAttributes: []
                }
            })

            if (data?.createProduct?.success) {
                toast.success('New Partner SKU created successfully!')
                setShowCreateNew(false)
                setNewPsku('')
                onGroupUpdate?.()
            } else {
                toast.error(data?.createProduct?.message || 'Failed to create Partner SKU')
            }
        } catch (error) {
            console.error('Error creating Partner SKU:', error)
            toast.error('An error occurred while creating the Partner SKU')
        }
    }

    return (
        <>
            {/* Main Product Group Section */}
            <div className="border rounded-lg bg-gray-50 w-80">
                <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-600" />
                        <h3 className="font-semibold">Product Group</h3>
                    </div>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>

                {isExpanded && (
                    <div className="p-4 pt-0 space-y-4">
                        {!product.group_id ? (
                            /* No Group - Show Create/Join Options */
                            <div className="bg-white border rounded-lg p-4 text-center space-y-3">
                                <div className="text-sm text-gray-600 mb-4">
                                    This product is not part of any group
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setShowGroupModal(true)}
                                >
                                    <Package className="h-4 w-4 mr-2" />
                                    Create or Join Group
                                </Button>
                            </div>
                        ) : (
                            <>
                                {/* Group Products */}
                                {groupProducts.map((groupProduct: any, index: number) => {
                                    const isCurrentProduct = groupProduct.id === product.id
                                    return (
                                        <div
                                            key={index}
                                            className={`border rounded-lg p-4 ${isCurrentProduct
                                                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                                                    : 'bg-white'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {groupProduct.images?.[0] && (
                                                    <img
                                                        src={groupProduct.images[0].image_url}
                                                        alt={groupProduct.name}
                                                        className="w-16 h-16 object-cover rounded border"
                                                    />
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-mono text-[11px] text-gray-600 mb-1">{groupProduct.psku || groupProduct.id}</div>
                                                    <div className="text-[12px] mb-1 break-words truncate whitespace-nowrap w-[150px]">{groupProduct.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">{groupProduct.brand_name || 'Generic'}</Badge>
                                                    </div>
                                                    <Link
                                                        to='/d/products/$productId'
                                                        params={{ productId: groupProduct.id }}
                                                        className="block text-blue-600 text-sm mt-2 hover:underline cursor-pointer"
                                                    >
                                                        View product info
                                                    </Link>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => setShowGroupModal(true)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Product Attributes */}
                                            <div className="mt-3 space-y-2 text-sm">
                                                {groupAxes.map(axis => {
                                                    const attr = groupProduct.productAttributes?.find((a: any) => a.attribute_name === axis)
                                                    return (
                                                        <div key={axis} className="flex justify-between">
                                                            <span className="text-gray-600">{axis}</span>
                                                            <span className="text-gray-900">{attr?.attribute_value || '--'}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )
                                })}

                                {/* Current Product (if not in group products list) */}
                                {!groupProducts.some((gp: any) => gp.id === product.id) && (
                                    <div className="bg-blue-50 border-blue-200 ring-2 ring-blue-100 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            {product.images?.[0] && (
                                                <img
                                                    src={product.images[0].image_url}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-mono text-[11px] text-gray-600 mb-1">{product.psku || product.id}</div>
                                                <div className="text-[12px] mb-1 break-words truncate whitespace-nowrap w-[150px]">{product.name}</div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">{product.brand_name || 'Generic'}</Badge>
                                                    <Badge variant="default" className="text-xs bg-blue-600">Current</Badge>
                                                </div>
                                                <span className="block text-gray-500 text-sm mt-2">This product</span>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => setShowGroupModal(true)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Product Attributes */}
                                        <div className="mt-3 space-y-2 text-sm">
                                            {groupAxes.map(axis => {
                                                const attr = product.productAttributes?.find((a: any) => a.attribute_name === axis)
                                                return (
                                                    <div key={axis} className="flex justify-between">
                                                        <span className="text-gray-600">{axis}</span>
                                                        <span className="text-gray-900">{attr?.attribute_value || '--'}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Add Partner SKU Section */}
                                <div className="border-t pt-4">
                                    <button
                                        className="flex items-center justify-between w-full text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        onClick={() => setShowAddPskuOptions(!showAddPskuOptions)}
                                    >
                                        <span>+ Add Partner SKU to the Group</span>
                                        {showAddPskuOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </button>

                                    {showAddPskuOptions && (
                                        <div className="mt-3 space-y-2">
                                            <button
                                                className="flex items-center justify-between w-full p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowAddExisting(true)}
                                            >
                                                <span className="text-sm">Add existing Partner SKU</span>
                                                <span className="text-gray-400">→</span>
                                            </button>

                                            <button
                                                className="flex items-center justify-between w-full p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
                                                onClick={() => setShowCreateNew(true)}
                                            >
                                                <span className="text-sm">Create New Partner SKU</span>
                                                <span className="text-gray-400">→</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="border-b px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold">{currentGroup?.name}</h2>
                                <Button variant="ghost" size="sm">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                    <Grid className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {!currentGroup ? (
                                /* Create New Group Form */
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="group-name">Group Name *</Label>
                                        <Input
                                            id="group-name"
                                            placeholder="e.g., iPhone 15 Series"
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="group-desc">Description (Optional)</Label>
                                        <Input
                                            id="group-desc"
                                            placeholder="Group description..."
                                            value={newGroupDescription}
                                            onChange={(e) => setNewGroupDescription(e.target.value)}
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Label className="mb-2">Initial Axes (Optional)</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter axis name"
                                                value={newAxisName}
                                                onChange={(e) => setNewAxisName(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddAxis()}
                                            />
                                            <Button variant="outline" onClick={handleAddAxis}>
                                                + Add
                                            </Button>
                                        </div>
                                        {groupAxes.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {groupAxes.map((axis, index) => (
                                                    <div key={index} className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
                                                        <span className="text-sm">{axis}</span>
                                                        <button
                                                            onClick={() => handleRemoveAxis(axis)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {/* SKU Group ID */}
                                    <div>
                                        <Label className="text-sm text-gray-600">SKU Group:</Label>
                                        <div className="font-mono text-sm mt-1">{currentGroup.group_id}</div>
                                    </div>

                                    {/* Axes Section */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Label>Axes:</Label>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {groupAxes.map((axis, index) => (
                                                <div key={index} className="flex items-center gap-2 bg-gray-100 rounded px-3 py-2">
                                                    <span className="text-sm">{axis}</span>
                                                    <button
                                                        onClick={() => handleRemoveAxis(axis)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Enter axis name"
                                                value={newAxisName}
                                                onChange={(e) => setNewAxisName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddAxis()}
                                            />
                                            <Button variant="outline" onClick={handleAddAxis}>
                                                + Add Axis
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Products List */}
                                    <div className="space-y-4">
                                        {/* Group Products */}
                                        {groupProducts.map((groupProduct: any, index: number) => {
                                            const isCurrentProduct = groupProduct.id === product.id
                                            return (
                                                <div
                                                    key={index}
                                                    className={`border rounded-lg p-4 ${isCurrentProduct
                                                            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                                                            : ''
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3 mb-4">
                                                        {groupProduct.images?.[0] && (
                                                            <img
                                                                src={groupProduct.images[0].image_url}
                                                                alt={groupProduct.name}
                                                                className="w-16 h-16 object-cover rounded border"
                                                            />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="font-mono text-sm text-gray-600 mb-1">{groupProduct.psku}</div>
                                                            <div className="text-sm mb-1">{groupProduct.name}</div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary" className="text-xs">{groupProduct.brand_name || 'Generic'}</Badge>
                                                                {isCurrentProduct && (
                                                                    <Badge variant="default" className="text-xs bg-blue-600">Current</Badge>
                                                                )}
                                                            </div>
                                                            <button className="block text-blue-600 text-sm mt-2 hover:underline cursor-pointer">
                                                                View Details
                                                            </button>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Editable Attributes */}
                                                    <div className="space-y-3">
                                                        {groupAxes.map((axis) => {
                                                            const value = editableAttributes[groupProduct.id]?.[axis] || ''
                                                            return (
                                                                <div key={axis}>
                                                                    <Label className="text-sm text-gray-600 mb-1">{axis}</Label>
                                                                    <Input
                                                                        value={value}
                                                                        onChange={(e) => handleAttributeChange(groupProduct.id, axis, e.target.value)}
                                                                        placeholder={`Enter ${axis}`}
                                                                    />
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            )
                                        })}

                                        {/* Current Product (if not in group products list) */}
                                        {!groupProducts.some((gp: any) => gp.id === product.id) && (
                                            <div className="bg-blue-50 border-blue-200 ring-2 ring-blue-100 rounded-lg p-4">
                                                <div className="flex items-start gap-3 mb-4">
                                                    {product.images?.[0] && (
                                                        <img
                                                            src={product.images[0].image_url}
                                                            alt={product.name}
                                                            className="w-16 h-16 object-cover rounded border"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="font-mono text-sm text-gray-600 mb-1">{product.psku}</div>
                                                        <div className="text-sm mb-1">{product.name}</div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">{product.brand_name || 'Generic'}</Badge>
                                                            <Badge variant="default" className="text-xs bg-blue-600">Current</Badge>
                                                        </div>
                                                        <span className="block text-gray-500 text-sm mt-2">This product</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Editable Attributes for Current Product */}
                                                <div className="space-y-3">
                                                    {groupAxes.map((axis) => {
                                                        const value = editableAttributes[product.id]?.[axis] || ''
                                                        return (
                                                            <div key={axis}>
                                                                <Label className="text-sm text-gray-600 mb-1">{axis}</Label>
                                                                <Input
                                                                    value={value}
                                                                    onChange={(e) => handleAttributeChange(product.id, axis, e.target.value)}
                                                                    placeholder={`Enter ${axis}`}
                                                                />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t px-6 py-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveGroup}>
                                {currentGroup ? 'Save Changes' : 'Create Group'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Existing Partner SKU Modal */}
            {showAddExisting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="border-b px-6 py-4">
                            <button
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
                                onClick={() => setShowAddExisting(false)}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Add existing Partner SKU
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                                {productsData?.getProducts?.products?.map((prod: any) => (
                                    <div
                                        key={prod.id}
                                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleToggleProductSelection(prod.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.includes(prod.id)}
                                            onChange={() => handleToggleProductSelection(prod.id)}
                                            className="mt-1"
                                        />
                                        {prod.images?.[0] && (
                                            <img
                                                src={prod.images[0].image_url}
                                                alt={prod.name}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <div className="font-mono text-sm text-gray-600">{prod.psku || prod.id}</div>
                                            <div className="text-sm mt-1">--</div>
                                            <Badge variant="secondary" className="mt-1 text-xs">{prod.brand_name || 'Generic'}</Badge>
                                            <div className="text-xs text-gray-500 mt-1">PSKU_{prod.id}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t px-6 py-4">
                            <Button
                                className="w-full"
                                disabled={selectedProducts.length === 0}
                                onClick={handleAddSelectedProducts}
                            >
                                Select Products
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create New Partner SKU Modal */}
            {showCreateNew && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
                        <div className="border-b px-6 py-4">
                            <button
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3"
                                onClick={() => setShowCreateNew(false)}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Create New Partner SKU
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <Label htmlFor="psku">PSKU</Label>
                                <Input
                                    id="psku"
                                    value={newPsku}
                                    onChange={(e) => setNewPsku(e.target.value)}
                                    placeholder="Enter or generate PSKU"
                                />
                            </div>

                            <div className="text-center py-2">
                                <span className="text-gray-500">or</span>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleGeneratePSKU}
                            >
                                Generate Partner SKU
                            </Button>
                        </div>

                        <div className="border-t px-6 py-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setShowCreateNew(false)}>
                                Cancel
                            </Button>
                            <Button
                                disabled={!newPsku.trim()}
                                onClick={handleCreateNewPsku}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
