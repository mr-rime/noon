import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { ChevronDown, ChevronUp, Trash2, Package, X, Edit, Grid, Search, ArrowLeft, Loader2 } from 'lucide-react'
import { GET_PRODUCT_GROUPS, CREATE_PRODUCT_GROUP, UPDATE_PRODUCT_GROUP, ADD_PRODUCT_TO_GROUP, CREATE_PSKU_PRODUCT, REMOVE_PRODUCT_FROM_GROUP, DELETE_PRODUCT_GROUP } from '@/graphql/psku'
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
    const [pskuValidationMessage, setPskuValidationMessage] = useState('')
    const [isValidatingPsku, setIsValidatingPsku] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [productToDelete, setProductToDelete] = useState<{ id: string, name: string } | null>(null)
    const [isCreatingPsku, setIsCreatingPsku] = useState(false)
    const [isSavingGroup, setIsSavingGroup] = useState(false)
    const [isDeletingProduct, setIsDeletingProduct] = useState(false)
    const [showDeleteGroupConfirm, setShowDeleteGroupConfirm] = useState(false)
    const [isDeletingGroup, setIsDeletingGroup] = useState(false)


    const { data: groupsData, refetch: refetchGroups } = useQuery(GET_PRODUCT_GROUPS, {
        variables: { category_id: product.category_id },
        skip: !product.category_id
    })

    const { data: productsData } = useQuery(GET_PRODUCTS, {
        variables: { limit: 50, offset: 0, search: searchQuery },
        skip: !showAddExisting
    })


    const availableProducts = productsData?.getProducts?.products?.filter((prod: any) => {

        if (prod.id === product.id) return false


        const isInGroup = groupProducts.some((gp: any) => gp.id === prod.id)
        if (isInGroup) return false


        return true
    }) || []

    const currentGroup = groupsData?.getProductGroups?.groups?.find((g: ProductGroup) => g.group_id === product.group_id)

    useEffect(() => {
        if (currentGroup) {

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


    useEffect(() => {
        if (showGroupModal && currentGroup) {
            const attrs: Record<string, Record<string, string>> = {}


            attrs[product.id] = {}
            product.productAttributes?.forEach(attr => {
                attrs[product.id][attr.attribute_name] = attr.attribute_value
            })


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

        if (product.groupProducts && product.groupProducts.length > 0) {

            setGroupProducts(product.groupProducts.map((p: any) =>
                typeof p === 'string' ? { id: p } : p
            ))
        }
    }, [product.groupProducts])

    const [createGroup] = useMutation(CREATE_PRODUCT_GROUP)
    const [updateGroup] = useMutation(UPDATE_PRODUCT_GROUP)
    const [deleteGroup] = useMutation(DELETE_PRODUCT_GROUP)
    const [addProductToGroup] = useMutation(ADD_PRODUCT_TO_GROUP)
    const [createPskuProduct] = useMutation(CREATE_PSKU_PRODUCT)
    const [updateProduct] = useMutation(UPDATE_PRODUCT)
    const [removeProductFromGroup] = useMutation(REMOVE_PRODUCT_FROM_GROUP)


    const validatePsku = async (psku: string) => {
        if (!psku.trim()) {
            setPskuValidationMessage('')
            return true
        }

        setIsValidatingPsku(true)

        try {

            const isDashboard = window.location.hostname === 'dashboard.localhost'
            const hostname = window.location.hostname

            let graphqlUrl = 'http://localhost:8000/graphql'

            if (isDashboard) {
                graphqlUrl = 'http://dashboard.localhost:8000/graphql'
            } else if (hostname === 'noon-market.vercel.app') {
                graphqlUrl = 'https://noon-btwv.onrender.com/graphql'
            } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
                graphqlUrl = 'http://localhost:8000/graphql'
            }

            const response = await fetch(graphqlUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `
                        query ValidatePsku($psku: String!) {
                            validatePsku(psku: $psku)
                        }
                    `,
                    variables: { psku: psku.trim() }
                })
            })

            const data = await response.json()
            console.log('PSKU validation response for:', psku.trim(), data)


            if (data.errors) {
                console.error('GraphQL errors:', data.errors)
                setPskuValidationMessage('Error validating PSKU: ' + data.errors[0]?.message)
                return false
            }

            if (data.data?.validatePsku === true) {
                setPskuValidationMessage('PSKU is available')
                return true
            } else if (data.data?.validatePsku === false) {
                setPskuValidationMessage('PSKU already exists')
                return false
            } else {
                console.error('Unexpected response:', data.data)
                setPskuValidationMessage('Error validating PSKU: unexpected response')
                return false
            }
        } catch (error) {
            console.error('Error validating PSKU:', error)
            setPskuValidationMessage('Error validating PSKU')
            return false
        } finally {
            setIsValidatingPsku(false)
        }
    }

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

        if (!currentGroup) {
            setNewGroupName('')
            setNewGroupDescription('')
            setGroupAxes([])
            setNewAxisName('')
        }
    }

    const handleSaveGroup = async () => {
        setIsSavingGroup(true)


        if (!currentGroup) {
            if (!newGroupName.trim()) {
                toast.error('Group name is required')
                setIsSavingGroup(false)
                return
            }

            try {

                toast.loading('Creating group...', { id: 'create-group' })

                const { data } = await createGroup({
                    variables: {
                        input: {
                            name: newGroupName.trim(),
                            description: newGroupDescription.trim() || null,
                            category_id: product.category_id,
                            brand_id: product.brand_id,
                            attributes: groupAxes
                        }
                    }
                });

                if (data?.createProductGroup?.success) {
                    const newGroupId = data.createProductGroup.group.group_id


                    await addProductToGroup({
                        variables: {
                            product_id: product.id,
                            group_id: newGroupId
                        }
                    })

                    toast.success('Group created successfully!', { id: 'create-group' })
                    setShowGroupModal(false)
                    setNewGroupName('')
                    setNewGroupDescription('')
                    setGroupAxes([])
                    refetchGroups()
                    onGroupUpdate?.()
                } else {
                    toast.error(data?.createProductGroup?.message || 'Failed to create group', { id: 'create-group' })
                }
            } catch (error) {
                console.error('Error creating group:', error)
                toast.error('An error occurred while creating the group', { id: 'create-group' })
            } finally {
                setIsSavingGroup(false)
            }
            return
        }


        try {

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


            const productIds = [product.id, ...groupProducts.map(p => p.id)]
            const updatePromises = productIds.map(async (productId) => {
                const attributes = editableAttributes[productId] || {}

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
        } finally {
            setIsSavingGroup(false)
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

    const handleAddSelectedProducts = async () => {
        if (!currentGroup) {
            toast.error('Please select a group first')
            return
        }

        try {

            const addPromises = selectedProducts.map(productId =>
                addProductToGroup({
                    variables: {
                        product_id: productId,
                        group_id: currentGroup.group_id
                    }
                })
            )

            await Promise.all(addPromises)

            toast.success(`${selectedProducts.length} product(s) added to group successfully!`)
            setShowAddExisting(false)
            setSelectedProducts([])
            onGroupUpdate?.()
        } catch (error) {
            console.error('Error adding products to group:', error)
            toast.error('Failed to add products to group')
        }
    }

    const handleGeneratePSKU = () => {

        const timestamp = Date.now().toString(36)
        const random = Math.random().toString(36).substring(2, 15)
        setNewPsku(`PSKU_${timestamp}${random}`.toUpperCase())
    }

    const handleRemoveProductFromGroup = (productId: string, productName: string) => {
        setProductToDelete({ id: productId, name: productName })
        setShowDeleteConfirm(true)
    }

    const confirmRemoveProduct = async () => {
        if (!productToDelete) return

        setIsDeletingProduct(true)


        const productToRemove = productToDelete
        setGroupProducts(prev => prev.filter(p => p.id !== productToRemove.id))

        try {
            const { data } = await removeProductFromGroup({
                variables: { product_id: productToDelete.id }
            })

            if (data?.updateProduct?.success) {
                toast.success(`Product removed from group successfully!`)
                onGroupUpdate?.()
            } else {

                setGroupProducts(prev => {
                    const existingProduct = groupProducts.find(p => p.id === productToRemove.id)
                    return existingProduct ? [...prev, existingProduct] : prev
                })
                toast.error(data?.updateProduct?.message || 'Failed to remove product from group')
            }
        } catch (error) {

            setGroupProducts(prev => {
                const existingProduct = groupProducts.find(p => p.id === productToRemove.id)
                return existingProduct ? [...prev, existingProduct] : prev
            })
            console.error('Error removing product from group:', error)
            toast.error('An error occurred while removing the product from group')
        } finally {
            setIsDeletingProduct(false)
            setShowDeleteConfirm(false)
            setProductToDelete(null)
        }
    }

    const handleDeleteGroup = () => {
        if (!currentGroup) return
        setShowDeleteGroupConfirm(true)
    }

    const confirmDeleteGroup = async () => {
        if (!currentGroup) return

        setIsDeletingGroup(true)

        try {

            toast.loading('Deleting group...', { id: 'delete-group' })


            setShowGroupModal(false)

            const { data } = await deleteGroup({
                variables: { groupId: currentGroup.group_id },
                optimisticResponse: {
                    deleteProductGroup: {
                        __typename: 'ProductGroupResponse',
                        success: true,
                        message: 'Deleting group...'
                    }
                },
                update: (cache, { data }) => {
                    if (data?.deleteProductGroup?.success) {

                        const existingGroups = cache.readQuery({
                            query: GET_PRODUCT_GROUPS,
                            variables: { category_id: product.category_id }
                        }) as any

                        if (existingGroups?.getProductGroups) {
                            cache.writeQuery({
                                query: GET_PRODUCT_GROUPS,
                                variables: { category_id: product.category_id },
                                data: {
                                    getProductGroups: {
                                        ...existingGroups.getProductGroups,
                                        groups: existingGroups.getProductGroups.groups.filter(
                                            (group: any) => group.group_id !== currentGroup.group_id
                                        )
                                    }
                                }
                            })
                        }
                    }
                }
            })

            if (data?.deleteProductGroup?.success) {
                toast.success('Product group deleted successfully!', { id: 'delete-group' })
                onGroupUpdate?.()
            } else {

                setShowGroupModal(true)
                toast.error(data?.deleteProductGroup?.message || 'Failed to delete product group', { id: 'delete-group' })
            }
        } catch (error) {
            console.error('Error deleting product group:', error)
            toast.error('An error occurred while deleting the product group', { id: 'delete-group' })

            setShowGroupModal(true)

        } finally {
            setIsDeletingGroup(false)
            setShowDeleteGroupConfirm(false)
        }
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


        const isValid = await validatePsku(newPsku.trim())
        if (!isValid) {
            toast.error('PSKU already exists. Please choose a different one.')
            return
        }

        setIsCreatingPsku(true)


        const optimisticProduct = {
            id: `temp-${Date.now()}`,
            name: `Product ${newPsku}`,
            psku: newPsku.trim(),
            price: product.price,
            currency: product.currency,
            group_id: currentGroup.group_id,
            is_temp: true
        }


        setGroupProducts(prev => [...prev, optimisticProduct])

        try {
            const productData = {
                name: `Product ${newPsku}`,
                psku: newPsku.trim(),
                price: product.price,
                currency: (product.currency && product.currency !== '0') ? product.currency : 'USD',
                category_id: product.category_id,
                subcategory_id: product.subcategory_id,
                brand_id: product.brand_id,
                group_id: currentGroup.group_id,
                stock: 0,
                is_returnable: product.is_returnable,
                is_public: product.is_public || false,
                product_overview: '',
                images: [],
                productSpecifications: [],
                productAttributes: []
            }

            console.log('Creating product with data:', productData)

            const { data } = await createPskuProduct({
                variables: productData
            })

            console.log('Create product response:', data)

            if (data?.createProduct?.success) {
                const realProduct = data.createProduct.product

                if (realProduct) {
                    toast.success('New Partner SKU created successfully!')
                    setShowCreateNew(false)
                    setNewPsku('')
                    setPskuValidationMessage('')


                    setGroupProducts(prev =>
                        prev.map(p => p.id === optimisticProduct.id ? realProduct : p)
                    )

                    onGroupUpdate?.()
                } else {

                    setGroupProducts(prev => prev.filter(p => p.id !== optimisticProduct.id))
                    console.error('Product creation succeeded but product data is null:', data)
                    toast.error('Product was created but failed to retrieve data. Please refresh the page.')
                }
            } else {

                setGroupProducts(prev => prev.filter(p => p.id !== optimisticProduct.id))
                toast.error(data?.createProduct?.message || 'Failed to create Partner SKU')
            }
        } catch (error) {

            setGroupProducts(prev => prev.filter(p => p.id !== optimisticProduct.id))
            console.error('Error creating Partner SKU:', error)
            toast.error('An error occurred while creating the Partner SKU')
        } finally {
            setIsCreatingPsku(false)
        }
    }

    return (
        <>

            <div className="border rounded-lg bg-gray-50 w-fit min-w-80">
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

                                {groupProducts.map((groupProduct: any, index: number) => {
                                    const isCurrentProduct = groupProduct.id === product.id
                                    return (
                                        <div
                                            key={index}
                                            className={`border rounded-lg p-4 ${isCurrentProduct
                                                ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                                                : groupProduct.is_temp
                                                    ? 'bg-yellow-50 border-yellow-200'
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
                                                    <div className="font-mono text-[11px] text-gray-600 mb-1 flex items-center gap-2">
                                                        {groupProduct.psku || groupProduct.id}
                                                        {groupProduct.is_temp && <Loader2 className="h-3 w-3 animate-spin text-yellow-600" />}
                                                    </div>
                                                    <div className="text-[12px] mb-1 break-words truncate whitespace-nowrap w-[150px]">{groupProduct.name}</div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="text-xs">{groupProduct.brand_name || 'Generic'}</Badge>
                                                        {groupProduct.is_temp && <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">Creating...</Badge>}
                                                    </div>
                                                    <Link
                                                        to='/d/products/$productId'
                                                        params={{ productId: groupProduct.id }}
                                                        className="block text-blue-600 text-sm mt-2 hover:underline cursor-pointer"
                                                    >
                                                        View product info
                                                    </Link>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowGroupModal(true)}
                                                        disabled={groupProduct.is_temp}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemoveProductFromGroup(groupProduct.id, groupProduct.name)}
                                                        disabled={isCurrentProduct || groupProduct.is_temp}
                                                        title={isCurrentProduct ? "Cannot remove current product" : groupProduct.is_temp ? "Product is being created" : "Remove from group"}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            </div>


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
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" onClick={() => setShowGroupModal(true)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveProductFromGroup(product.id, product.name)}
                                                    title="Remove current product from group"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-600" />
                                                </Button>
                                            </div>
                                        </div>


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


            {showGroupModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                        <div className="border-b px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold">{currentGroup?.name}</h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDeleteGroup}
                                    title="Delete group"
                                >
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


                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {!currentGroup ? (

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
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddAxis()}
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

                                    <div>
                                        <Label className="text-sm text-gray-600">SKU Group:</Label>
                                        <div className="font-mono text-sm mt-1">{currentGroup.group_id}</div>
                                    </div>


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


                                    <div className="space-y-4">

                                        {groupProducts.map((groupProduct: any, index: number) => {
                                            const isCurrentProduct = groupProduct.id === product.id
                                            return (
                                                <div
                                                    key={index}
                                                    className={`border rounded-lg p-4 ${isCurrentProduct
                                                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100'
                                                        : groupProduct.is_temp
                                                            ? 'bg-yellow-50 border-yellow-200'
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
                                                            <div className="font-mono text-sm text-gray-600 mb-1 flex items-center gap-2">
                                                                {groupProduct.psku}
                                                                {groupProduct.is_temp && <Loader2 className="h-3 w-3 animate-spin text-yellow-600" />}
                                                            </div>
                                                            <div className="text-sm mb-1">{groupProduct.name}</div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary" className="text-xs">{groupProduct.brand_name || 'Generic'}</Badge>
                                                                {isCurrentProduct && (
                                                                    <Badge variant="default" className="text-xs bg-blue-600">Current</Badge>
                                                                )}
                                                                {groupProduct.is_temp && <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">Creating...</Badge>}
                                                            </div>
                                                            <button className="block text-blue-600 text-sm mt-2 hover:underline cursor-pointer">
                                                                View Details
                                                            </button>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={groupProduct.is_temp}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveProductFromGroup(groupProduct.id, groupProduct.name)}
                                                                disabled={isCurrentProduct || groupProduct.is_temp}
                                                                title={isCurrentProduct ? "Cannot remove current product" : groupProduct.is_temp ? "Product is being created" : "Remove from group"}
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </div>
                                                    </div>


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
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveProductFromGroup(product.id, product.name)}
                                                            title="Remove current product from group"
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </div>


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


                        <div className="border-t px-6 py-4 flex justify-end gap-3">
                            <Button variant="outline" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveGroup} disabled={isSavingGroup}>
                                {isSavingGroup && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                {currentGroup ? 'Save Changes' : 'Create Group'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}


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
                                {availableProducts.length === 0 && searchQuery && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No available products found for "{searchQuery}"</p>
                                        <p className="text-sm mt-1">Try searching for different terms or create a new Partner SKU</p>
                                    </div>
                                )}
                                {availableProducts.length === 0 && !searchQuery && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No products available to add to this group</p>
                                        <p className="text-sm mt-1">All existing products are either already in this group or excluded</p>
                                    </div>
                                )}
                                {availableProducts.map((prod: any) => (
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
                                            <div className="font-mono text-sm text-gray-600">
                                                {prod.psku ? (
                                                    <span className="text-green-600">PSKU: {prod.psku}</span>
                                                ) : (
                                                    <span className="text-orange-600">No PSKU - Can be assigned</span>
                                                )}
                                            </div>
                                            <div className="text-sm mt-1 font-medium">{prod.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-xs">{prod.brand_name || 'Generic'}</Badge>
                                                {prod.category_name && (
                                                    <Badge variant="outline" className="text-xs">{prod.category_name}</Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{prod.currency} {prod.final_price || prod.price}</div>
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
                                    onChange={(e) => {
                                        setNewPsku(e.target.value)

                                        setTimeout(() => validatePsku(e.target.value), 500)
                                    }}
                                    placeholder="Enter or generate PSKU"
                                    className={pskuValidationMessage.includes('already exists') ? 'border-red-500' : pskuValidationMessage.includes('available') ? 'border-green-500' : ''}
                                />
                                {isValidatingPsku && (
                                    <p className="text-sm text-gray-500 mt-1">Checking PSKU availability...</p>
                                )}
                                {pskuValidationMessage && !isValidatingPsku && (
                                    <p className={`text-sm mt-1 ${pskuValidationMessage.includes('already exists') ? 'text-red-600' : 'text-green-600'}`}>
                                        {pskuValidationMessage}
                                    </p>
                                )}
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
                                disabled={!newPsku.trim() || pskuValidationMessage.includes('already exists') || isValidatingPsku || isCreatingPsku}
                                onClick={handleCreateNewPsku}
                            >
                                {isCreatingPsku && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            )}


            {showDeleteConfirm && productToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Remove Product from Group</h3>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">
                                Are you sure you want to remove <strong>"{productToDelete.name}"</strong> from this product group?
                            </p>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteConfirm(false)
                                        setProductToDelete(null)
                                    }}
                                    disabled={isDeletingProduct}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmRemoveProduct}
                                    disabled={isDeletingProduct}
                                >
                                    {isDeletingProduct && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Remove Product
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {showDeleteGroupConfirm && currentGroup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Delete Product Group</h3>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete the product group <strong>"{currentGroup.name}"</strong>? This will remove all products from the group.
                            </p>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowDeleteGroupConfirm(false)
                                    }}
                                    disabled={isDeletingGroup}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmDeleteGroup}
                                    disabled={isDeletingGroup}
                                >
                                    {isDeletingGroup && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Delete Group
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
