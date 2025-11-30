import { gql } from '@apollo/client'

export const GET_CATEGORIES = gql`
  query GetCategories($search: String) {
    getCategories(search: $search) {
      success
      message
      categories {
        category_id
        parent_id
        name
        slug
        description
        level
        path
        display_order
        is_active
        created_at
        updated_at
        children {
          category_id
          parent_id
          name
          slug
          level
          is_active
          children {
            category_id
            parent_id
            name
            slug
            level
            is_active
            children {
              category_id
              parent_id
              name
              slug
              level
              is_active
              children {
                category_id
                parent_id
                name
                slug
                level
                is_active
              }
            }
          }
        }
        subcategories {
          subcategory_id
          name
          slug
          description
          is_active
        }
      }
    }
  }
`

export const GET_CATEGORY_BY_NESTED_PATH = gql`
  query GetCategoryByNestedPath($path: String!) {
    getCategoryByNestedPath(path: $path) {
      success
      message
      category {
        category_id
        name
        slug
        description
        level
        children {
          category_id
          name
          slug
          product_count
          level
          children {
            category_id
            name
            slug
            product_count
            level
            children {
              category_id
              name
              slug
              product_count
              level
            }
          }
        }
      }
    }
  }
`

export const GET_CATEGORY = gql`
  query GetCategory($id: String!) {
    getCategory(id: $id) {
      success
      message
      category {
        category_id
        name
        slug
        description
        is_active
        created_at
        updated_at
        subcategories {
          subcategory_id
          name
          slug
          description
          is_active
        }
      }
    }
  }
`

export const GET_SUBCATEGORIES = gql`
  query GetSubcategories($category_id: String, $search: String) {
    getSubcategories(category_id: $category_id, search: $search) {
      success
      message
      subcategories {
        subcategory_id
        category_id
        name
        slug
        description
        is_active
        created_at
        updated_at
      }
    }
  }
`

export const GET_HIERARCHICAL_CATEGORIES = gql`
  query GetHierarchicalCategories($rootCategoryId: String, $maxDepth: Int) {
    getHierarchicalCategories(rootCategoryId: $rootCategoryId, maxDepth: $maxDepth) {
      success
      categories {
        category_id
        parent_id
        name
        slug
        level
        product_count
        hasChildren
        children {
          category_id
          parent_id
          name
          slug
          level
          product_count
          hasChildren
          children {
            category_id
            parent_id
            name
            slug
            level
            product_count
            hasChildren
            children {
              category_id
              parent_id
              name
              slug
              level
              product_count
              hasChildren
              children {
                category_id
                parent_id
                name
                slug
                level
                product_count
                hasChildren
                children {
                    category_id
                    parent_id
                    name
                    slug
                    level
                    product_count
                    hasChildren
                }
              }
            }
          }
        }
      }
    }
  }
`

export const GET_CATEGORY_BREADCRUMB = gql`
  query GetCategoryBreadcrumb($categoryId: String!) {
    getCategoryBreadcrumb(categoryId: $categoryId) {
      success
      breadcrumb {
        id
        name
        slug
        level
      }
    }
  }
`
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      success
      message
      category {
        category_id
        name
        slug
        description
        is_active
      }
    }
  }
`

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: String!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      success
      message
      category {
        category_id
        name
        slug
        description
        is_active
      }
    }
  }
`

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`

export const CREATE_SUBCATEGORY = gql`
  mutation CreateSubcategory($input: SubcategoryInput!) {
    createSubcategory(input: $input) {
      success
      message
      subcategory {
        subcategory_id
        category_id
        name
        slug
        description
        is_active
      }
    }
  }
`

export const UPDATE_SUBCATEGORY = gql`
  mutation UpdateSubcategory($id: String!, $input: SubcategoryInput!) {
    updateSubcategory(id: $id, input: $input) {
      success
      message
      subcategory {
        subcategory_id
        category_id
        name
        slug
        description
        is_active
      }
    }
  }
`

export const DELETE_SUBCATEGORY = gql`
  mutation DeleteSubcategory($id: String!) {
    deleteSubcategory(id: $id) {
      success
      message
    }
  }
`
