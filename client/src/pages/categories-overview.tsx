import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Loader2, Grid3X3, List, Search } from 'lucide-react'
import CategoryCarousel from '../components/category/category-carousel'
import CategoryTree, { CategoryGrid } from '../components/category/category-tree'
import { GET_CATEGORIES } from '../graphql/category'



export default function CategoriesOverview() {
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid')

    const { data, loading, error } = useQuery(GET_CATEGORIES, {
        variables: {
            search: searchTerm,
            parentId: null,
            includeChildren: true
        },
        fetchPolicy: 'cache-and-network'
    })

    const categories = data?.getCategories?.categories || []

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Error loading categories</h2>
                <p className="text-gray-600 mt-2">{error.message}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <CategoryCarousel />


            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">All Categories</h1>
                            <p className="text-gray-600 mt-1">
                                Browse through our complete collection of product categories
                            </p>
                        </div>


                        <div className="flex flex-col sm:flex-row gap-3">

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>


                            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'grid'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                    Grid
                                </button>
                                <button
                                    onClick={() => setViewMode('tree')}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${viewMode === 'tree'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <List className="h-4 w-4" />
                                    Tree
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                {categories.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
                        <p className="text-gray-600">
                            {searchTerm ? 'Try adjusting your search terms.' : 'No categories are available at the moment.'}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {searchTerm ? 'Search Results' : 'Categories'}
                            </h2>
                            <span className="text-sm text-gray-500">
                                {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                            </span>
                        </div>

                        {viewMode === 'grid' ? (
                            <CategoryGrid
                                categories={categories}
                                currentPath=""
                                isNestedPath={false}
                                basePath=""
                                columns={4}
                                className=""
                            />
                        ) : (
                            <CategoryTree
                                categories={categories}
                                currentPath=""
                                isNestedPath={false}
                                basePath=""
                                maxDepth={5}
                                showExpandCollapse={true}
                                className=""
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
