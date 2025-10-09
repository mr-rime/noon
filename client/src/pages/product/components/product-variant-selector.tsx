import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'

interface ProductVariant {
    id?: string
    product_id?: string
    sku: string
    price?: number
    stock?: number
    image_url?: string
    option_combination?: string | any[]
    options?: Array<{ name: string; value: string }>
}

interface ProductVariantSelectorProps {
    variants: ProductVariant[]
    currentProductId: string
    currentVariant?: ProductVariant | null
    onVariantChange?: (variant: ProductVariant) => void
}

export function ProductVariantSelector({
    variants,
    currentProductId,
    currentVariant,
    onVariantChange
}: ProductVariantSelectorProps) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        currentVariant || variants.find(v => v.product_id === currentProductId) || variants[0] || null
    )

    // Group variants by their option combinations
    const getVariantOptions = (variant: ProductVariant) => {
        try {
            if (Array.isArray(variant.options)) {
                return variant.options
            }
            if (typeof variant.option_combination === 'string' && variant.option_combination) {
                const parsed = JSON.parse(variant.option_combination)
                return Array.isArray(parsed) ? parsed : []
            }
            if (Array.isArray(variant.option_combination)) {
                return variant.option_combination
            }
        } catch (error) {
            console.error('Error parsing variant options:', error)
        }
        return []
    }

    // Extract unique option names and their values
    const optionGroups = variants.reduce((acc, variant) => {
        const options = getVariantOptions(variant)
        options.forEach((opt: { name: string; value: string }) => {
            if (!acc[opt.name]) {
                acc[opt.name] = new Set()
            }
            acc[opt.name].add(opt.value)
        })
        return acc
    }, {} as Record<string, Set<string>>)

    const handleVariantSelect = (variant: ProductVariant) => {
        setSelectedVariant(variant)
        onVariantChange?.(variant)
    }

    const handleOptionSelect = (optionName: string, optionValue: string) => {
        // Find a variant that matches this option value
        const matchingVariant = variants.find(variant => {
            const options = getVariantOptions(variant)
            return options.some((opt: { name: string; value: string }) =>
                opt.name === optionName && opt.value === optionValue
            )
        })

        if (matchingVariant) {
            handleVariantSelect(matchingVariant)
        }
    }

    if (variants.length === 0) {
        return null
    }

    const currentOptions = selectedVariant ? getVariantOptions(selectedVariant) : []

    return (
        <div className="w-full space-y-4">
            {Object.entries(optionGroups).map(([optionName, values]) => {
                const selectedValue = currentOptions.find((opt: { name: string }) => opt.name === optionName)?.value

                return (
                    <div key={optionName} className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{optionName}:</span>
                            {selectedValue && (
                                <span className="text-sm font-semibold text-gray-900">{selectedValue}</span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(values).map((value) => {
                                const isSelected = selectedValue === value
                                const isAvailable = variants.some(variant => {
                                    const options = getVariantOptions(variant)
                                    return options.some((opt: { name: string; value: string }) =>
                                        opt.name === optionName && opt.value === value
                                    ) && (variant.stock ?? 0) > 0
                                })

                                return (
                                    <Button
                                        key={value}
                                        disabled={!isAvailable}
                                        onClick={() => handleOptionSelect(optionName, value)}
                                        className={cn(
                                            'min-w-[60px]',
                                            isSelected && 'bg-primary text-primary-foreground',
                                            !isAvailable && 'opacity-50 cursor-not-allowed'
                                        )}
                                    >
                                        {value}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                )
            })}

            {/* Stock Information */}
            {selectedVariant && (
                <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">SKU:</span>
                        <Badge variant="secondary" className="font-mono text-xs">
                            {selectedVariant.sku}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-600">Availability:</span>
                        <Badge
                            variant={(selectedVariant.stock ?? 0) > 0 ? 'default' : 'destructive'}
                            className="text-xs"
                        >
                            {(selectedVariant.stock ?? 0) > 0
                                ? `${selectedVariant.stock} in stock`
                                : 'Out of stock'
                            }
                        </Badge>
                    </div>
                </div>
            )}
        </div>
    )
}

