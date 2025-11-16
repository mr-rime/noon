import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery } from '@apollo/client'
import { useNavigate } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react'
import { GET_CATEGORIES } from '@/graphql/category'

import { cn } from '@/utils/cn'

type RawCategory = {
    category_id: string
    name: string
    slug: string
    path?: string
    children?: RawCategory[]
    subcategories?: RawSubcategory[]
}

type RawSubcategory = {
    subcategory_id: string
    name: string
    slug: string
}

type DrawerCategory = {
    id: string
    name: string
    slug: string
    path: string
    children: DrawerCategory[]
}

interface MobileCategoryDrawerProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MobileCategoryDrawer({ open, onOpenChange }: MobileCategoryDrawerProps) {
    const navigate = useNavigate()
    const { data, loading } = useQuery(GET_CATEGORIES, {
        fetchPolicy: 'cache-first',
    })

    const [navStack, setNavStack] = useState<DrawerCategory[]>([])

    const categories = useMemo(() => {
        const rawCategories = (data?.getCategories?.categories as RawCategory[]) || []
        return normalizeCategories(rawCategories)
    }, [data?.getCategories?.categories])

    useEffect(() => {
        if (!open) {
            setNavStack([])
        }
    }, [open])

    useEffect(() => {
        if (!open) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = previousOverflow
        }
    }, [open])

    if (typeof document === 'undefined' || !open) return null

    const currentParent = navStack[navStack.length - 1]
    const currentCategories = currentParent ? currentParent.children : categories
    const title = currentParent ? currentParent.name : 'Shop by category'

    const handleNavigateToCategory = (category: DrawerCategory) => {
        const hasChildren = category.children.length > 0
        if (hasChildren) {
            setNavStack((prev) => [...prev, category])
            return
        }

        const fallbackPath = buildPath([...navStack.map((item) => item.slug), category.slug])
        const path = category.path || fallbackPath
        navigate({ to: '/category/$', params: { _splat: path } })
        onOpenChange(false)
    }

    const handleBack = () => {
        setNavStack((prev) => prev.slice(0, -1))
    }

    return createPortal(
        <div className="fixed inset-0 z-40 flex flex-col md:hidden">
            <div
                className="flex-1 bg-black/40 backdrop-blur-xs"
                onClick={() => onOpenChange(false)}
                aria-hidden="true"
            />
            <div className={cn('rounded-t-3xl bg-white shadow-xl max-h-[85vh] flex flex-col', 'animate-in slide-in-from-bottom duration-200')}>
                <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        {navStack.length > 0 && (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="rounded-full p-2 hover:bg-gray-100"
                                aria-label="Go back"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                        )}
                        <h2 className="text-base font-semibold text-[#343741]">{title}</h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="rounded-full p-2 hover:bg-gray-100"
                        aria-label="Close categories"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading categories
                        </div>
                    ) : currentCategories.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                            No categories available right now.
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {currentCategories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        type="button"
                                        onClick={() => handleNavigateToCategory(category)}
                                        className="flex w-full items-center justify-between px-4 py-3 text-left"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-[#1f2024]">{category.name}</p>
                                            {category.children.length === 0 && (
                                                <span className="text-xs text-gray-500">View products</span>
                                            )}
                                        </div>
                                        {category.children.length > 0 ? (
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <span className="text-xs font-semibold uppercase text-[#3866DF]">Go</span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>,
        document.body,
    )
}

function normalizeCategories(categories: RawCategory[], parentPath = ''): DrawerCategory[] {
    return categories.map((category) => {
        const sanitizedPath = sanitizePath(category.path) || buildPath([parentPath, category.slug])
        const childCategories = normalizeCategories(category.children || [], sanitizedPath)
        const subcategoryItems = (category.subcategories || []).map((sub) => ({
            id: `sub_${sub.subcategory_id}`,
            name: sub.name,
            slug: sub.slug,
            path: buildPath([sanitizedPath, sub.slug]),
            children: [],
        }))

        return {
            id: String(category.category_id),
            name: category.name,
            slug: category.slug,
            path: sanitizedPath,
            children: [...childCategories, ...subcategoryItems],
        }
    })
}

function buildPath(parts: Array<string | undefined>): string {
    return sanitizePath(parts.filter(Boolean).join('/'))
}

function sanitizePath(path?: string) {
    if (!path) return ''
    return path.replace(/^\/+/, '').replace(/\/+$/, '')
}
