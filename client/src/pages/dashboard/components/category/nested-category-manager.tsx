import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { gql } from '@apollo/client'
import { Plus, Edit2, Trash2, ChevronRight, ChevronDown, FolderPlus } from 'lucide-react'
import { toast } from 'sonner'

const GET_CATEGORY_TREE = gql`
  query GetCategoryTree {
    getCategories(includeChildren: true) {
      success
      categories {
        category_id
        parent_id
        name
        slug
        description
        level
        display_order
        is_active
        product_count
        children {
          category_id
          parent_id
          name
          slug
          level
          is_active
          product_count
          children {
            category_id
            parent_id
            name
            slug
            level
            is_active
            product_count
            children {
              category_id
              parent_id
              name
              slug
              level
              is_active
              product_count
              children {
                category_id
                parent_id
                name
                slug
                level
                is_active
                product_count
              }
            }
          }
        }
      }
    }
  }
`

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      success
      message
      category {
        category_id
        name
        slug
      }
    }
  }
`

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: Int!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      success
      message
      category {
        category_id
        name
        slug
      }
    }
  }
`

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`

interface Category {
  category_id: number
  parent_id?: number
  name: string
  slug: string
  description?: string
  level: number
  display_order?: number
  is_active: boolean
  product_count: number
  children?: Category[]
}

interface CategoryFormData {
  parent_id?: number
  name: string
  slug: string
  description?: string
  display_order?: number
  is_active: boolean
}

function CategoryForm({
  category,
  parentId,
  onClose,
  onSuccess
}: {
  category?: Category
  parentId?: number
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<CategoryFormData>({
    parent_id: parentId,
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    display_order: category?.display_order || 0,
    is_active: category?.is_active ?? true
  })
  
  const [createCategory] = useMutation(CREATE_CATEGORY)
  const [updateCategory] = useMutation(UPDATE_CATEGORY)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (category) {
        await updateCategory({
          variables: {
            id: category.category_id,
            input: formData
          }
        })
        toast.success('Category updated successfully')
      } else {
        await createCategory({
          variables: {
            input: formData
          }
        })
        toast.success('Category created successfully')
      }
      onSuccess()
      onClose()
    } catch {
      toast.error('Failed to save category')
    }
  }
  
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {
            const name = e.target.value
            setFormData({
              ...formData,
              name,
              slug: generateSlug(name)
            })
          }}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Display Order</label>
        <input
          type="number"
          value={formData.display_order}
          onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {category ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  )
}

function CategoryTreeItem({
  category,
  level = 0,
  maxLevel = 4,
  onRefresh
}: {
  category: Category
  level?: number
  maxLevel?: number
  onRefresh: () => void
}) {
  const [expanded, setExpanded] = useState(level < 2)
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  
  const [deleteCategory] = useMutation(DELETE_CATEGORY)
  const hasChildren = category.children && category.children.length > 0
  const canAddChild = level < maxLevel
  
  const handleDelete = async () => {
    if (hasChildren) {
      toast.error('Cannot delete category with subcategories')
      return
    }
    
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return
    }
    
    try {
      await deleteCategory({
        variables: { id: category.category_id }
      })
      toast.success('Category deleted successfully')
      onRefresh()
    } catch {
      toast.error('Failed to delete category')
    }
  }
  
  return (
    <div className={`${level > 0 ? 'ml-6' : ''}`}>
      <div className="group flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded">
        <div className="flex items-center flex-1">
          {/* Expand/Collapse Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-2 p-1 hover:bg-gray-200 rounded"
          >
            {hasChildren ? (
              expanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )
            ) : (
              <div className="w-6" />
            )}
          </button>
          
          {/* Category Info */}
          <div className="flex-1">
            <span className={`font-medium ${!category.is_active ? 'text-gray-400' : ''}`}>
              {category.name}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              (Level {category.level})
            </span>
            {category.product_count > 0 && (
              <span className="ml-2 text-xs text-blue-600">
                {category.product_count} products
              </span>
            )}
            {!category.is_active && (
              <span className="ml-2 text-xs text-red-600">Inactive</span>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {canAddChild && (
            <button
              onClick={() => setShowForm(true)}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
              title="Add subcategory"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setEditMode(true)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
            disabled={hasChildren}
          >
            <Trash2 className={`h-4 w-4 ${hasChildren ? 'opacity-50' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Edit Form */}
      {editMode && (
        <div className="ml-8 p-4 bg-gray-50 rounded-lg mb-2">
          <CategoryForm
            category={category}
            onClose={() => setEditMode(false)}
            onSuccess={onRefresh}
          />
        </div>
      )}
      
      {/* Add Child Form */}
      {showForm && (
        <div className="ml-8 p-4 bg-blue-50 rounded-lg mb-2">
          <h4 className="text-sm font-medium mb-3">Add subcategory to "{category.name}"</h4>
          <CategoryForm
            parentId={category.category_id}
            onClose={() => setShowForm(false)}
            onSuccess={onRefresh}
          />
        </div>
      )}
      
      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {category.children!.map(child => (
            <CategoryTreeItem
              key={child.category_id}
              category={child}
              level={level + 1}
              maxLevel={maxLevel}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function NestedCategoryManager() {
  const [showRootForm, setShowRootForm] = useState(false)
  
  const { data, loading, refetch } = useQuery(GET_CATEGORY_TREE)
  
  const categories = data?.getCategories?.categories || []
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Category Management</h2>
          <button
            onClick={() => setShowRootForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Root Category
          </button>
        </div>
      </div>
      
      <div className="p-6">
        {/* Root Category Form */}
        {showRootForm && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Add Root Category</h4>
            <CategoryForm
              onClose={() => setShowRootForm(false)}
              onSuccess={() => {
                setShowRootForm(false)
                refetch()
              }}
            />
          </div>
        )}
        
        {/* Category Tree */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No categories found. Create your first root category to get started.
          </div>
        ) : (
          <div className="space-y-1">
            {categories.map((category: Category) => (
              <CategoryTreeItem
                key={category.category_id}
                category={category}
                onRefresh={refetch}
              />
            ))}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Category Levels</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Level 0: Root categories (e.g., Electronics & Mobiles)</li>
            <li>• Level 1: Main subcategories (e.g., Mobiles & Accessories)</li>
            <li>• Level 2: Sub-subcategories (e.g., Accessories)</li>
            <li>• Level 3: Specific categories (e.g., Chargers)</li>
            <li>• Level 4: Most specific (e.g., Wireless Chargers)</li>
          </ul>
          <p className="mt-2 text-xs text-gray-500">Maximum nesting: 5 levels (0-4)</p>
        </div>
      </div>
    </div>
  )
}
