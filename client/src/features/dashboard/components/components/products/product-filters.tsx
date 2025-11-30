import { useState } from "react"

import { Filter, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"

interface ProductFiltersProps {
    onFiltersChange: (filters: any) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
    const [filters, setFilters] = useState({
        status: [] as string[],
        category: [] as string[],
        stockLevel: [] as string[]
    })

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Out of Stock", label: "Out of Stock" },
        { value: "Draft", label: "Draft" },
    ]

    const categoryOptions = [
        { value: "Electronics", label: "Electronics" },
        { value: "Wearables", label: "Wearables" },
        { value: "Accessories", label: "Accessories" },
        { value: "Cables", label: "Cables" },
    ]

    const stockLevelOptions = [
        { value: "in-stock", label: "In Stock (>20)" },
        { value: "low-stock", label: "Low Stock (1-20)" },
        { value: "out-of-stock", label: "Out of Stock (0)" },
    ]

    const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
        const updatedFilters = { ...filters }
        if (checked) {
            updatedFilters[filterType as keyof typeof filters] = [
                ...updatedFilters[filterType as keyof typeof filters],
                value
            ]
        } else {
            updatedFilters[filterType as keyof typeof filters] = updatedFilters[filterType as keyof typeof filters].filter(
                (item) => item !== value
            )
        }
        setFilters(updatedFilters)
        onFiltersChange(updatedFilters)
    }

    const clearFilter = (filterType: string, value: string) => {
        const updatedFilters = { ...filters }
        updatedFilters[filterType as keyof typeof filters] = updatedFilters[filterType as keyof typeof filters].filter(
            (item) => item !== value
        )
        setFilters(updatedFilters)
        onFiltersChange(updatedFilters)
    }

    const clearAllFilters = () => {
        const clearedFilters = {
            status: [] as string[],
            category: [] as string[],
            stockLevel: [] as string[]
        }
        setFilters(clearedFilters)
        onFiltersChange(clearedFilters)
    }

    const getActiveFiltersCount = () => {
        return filters.status.length + filters.category.length + filters.stockLevel.length
    }

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                        {getActiveFiltersCount() > 0 && (
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Filter Products</h4>
                            {getActiveFiltersCount() > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearAllFilters}
                                    className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                >
                                    Clear all
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="p-4 space-y-4">

                        <div>
                            <h5 className="font-medium mb-2">Status</h5>
                            <div className="space-y-2">
                                {statusOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`status-${option.value}`}
                                            checked={filters.status.includes(option.value)}
                                            onCheckedChange={(checked) =>
                                                handleFilterChange("status", option.value, !!checked)
                                            }
                                        />
                                        <label
                                            htmlFor={`status-${option.value}`}
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 className="font-medium mb-2">Category</h5>
                            <div className="space-y-2">
                                {categoryOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${option.value}`}
                                            checked={filters.category.includes(option.value)}
                                            onCheckedChange={(checked) =>
                                                handleFilterChange("category", option.value, !!checked)
                                            }
                                        />
                                        <label
                                            htmlFor={`category-${option.value}`}
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div>
                            <h5 className="font-medium mb-2">Stock Level</h5>
                            <div className="space-y-2">
                                {stockLevelOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`stock-${option.value}`}
                                            checked={filters.stockLevel.includes(option.value)}
                                            onCheckedChange={(checked) =>
                                                handleFilterChange("stockLevel", option.value, !!checked)
                                            }
                                        />
                                        <label
                                            htmlFor={`stock-${option.value}`}
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>


            {getActiveFiltersCount() > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {filters.status.map((status) => (
                        <Badge key={`status-${status}`} variant="secondary" className="gap-1">
                            Status: {status}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => clearFilter("status", status)}
                            />
                        </Badge>
                    ))}
                    {filters.category.map((category) => (
                        <Badge key={`category-${category}`} variant="secondary" className="gap-1">
                            Category: {category}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => clearFilter("category", category)}
                            />
                        </Badge>
                    ))}
                    {filters.stockLevel.map((stockLevel) => (
                        <Badge key={`stock-${stockLevel}`} variant="secondary" className="gap-1">
                            Stock: {stockLevelOptions.find(opt => opt.value === stockLevel)?.label}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => clearFilter("stockLevel", stockLevel)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}