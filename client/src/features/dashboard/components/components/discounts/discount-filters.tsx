import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"

interface DiscountFiltersProps {
    onFiltersChange: (filters: any) => void
}

export function DiscountFilters({ onFiltersChange }: DiscountFiltersProps) {
    const [filters, setFilters] = useState({
        status: [] as string[],
        type: [] as string[],
        timeRange: [] as string[]
    })

    const statusOptions = [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "upcoming", label: "Upcoming" },
    ]

    const typeOptions = [
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed Amount" },
    ]

    const timeRangeOptions = [
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "year", label: "This Year" },
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
            type: [] as string[],
            timeRange: [] as string[]
        }
        setFilters(clearedFilters)
        onFiltersChange(clearedFilters)
    }

    const getActiveFiltersCount = () => {
        return filters.status.length + filters.type.length + filters.timeRange.length
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
                <PopoverContent className="w-80 max-w-[90vw] p-0" align="start">
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Filter Discounts</h4>
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
                            <h5 className="font-medium mb-2">Discount Type</h5>
                            <div className="space-y-2">
                                {typeOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`type-${option.value}`}
                                            checked={filters.type.includes(option.value)}
                                            onCheckedChange={(checked) =>
                                                handleFilterChange("type", option.value, !!checked)
                                            }
                                        />
                                        <label
                                            htmlFor={`type-${option.value}`}
                                            className="text-sm font-medium cursor-pointer"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h5 className="font-medium mb-2">Time Range</h5>
                            <div className="space-y-2">
                                {timeRangeOptions.map((option) => (
                                    <div key={option.value} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`time-${option.value}`}
                                            checked={filters.timeRange.includes(option.value)}
                                            onCheckedChange={(checked) =>
                                                handleFilterChange("timeRange", option.value, !!checked)
                                            }
                                        />
                                        <label
                                            htmlFor={`time-${option.value}`}
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
                            Status: {statusOptions.find(opt => opt.value === status)?.label}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => clearFilter("status", status)}
                            />
                        </Badge>
                    ))}
                    {filters.type.map((type) => (
                        <Badge key={`type-${type}`} variant="secondary" className="gap-1">
                            Type: {typeOptions.find(opt => opt.value === type)?.label}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => clearFilter("type", type)}
                            />
                        </Badge>
                    ))}
                    {filters.timeRange.map((timeRange) => (
                        <Badge key={`time-${timeRange}`} variant="secondary" className="gap-1">
                            Time: {timeRangeOptions.find(opt => opt.value === timeRange)?.label}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => clearFilter("timeRange", timeRange)}
                            />
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    )
}
