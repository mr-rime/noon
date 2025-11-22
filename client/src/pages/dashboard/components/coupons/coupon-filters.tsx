import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"

interface CouponFiltersProps {
    onFiltersChange: (filters: any) => void
}

export function CouponFilters({ onFiltersChange }: CouponFiltersProps) {
    const [selectedStatus, setSelectedStatus] = useState<string[]>([])
    const [selectedType, setSelectedType] = useState<string[]>([])

    const handleStatusChange = (status: string) => {
        const newStatus = selectedStatus.includes(status)
            ? selectedStatus.filter((s) => s !== status)
            : [...selectedStatus, status]
        setSelectedStatus(newStatus)
        onFiltersChange({ status: newStatus, type: selectedType })
    }

    const handleTypeChange = (type: string) => {
        const newType = selectedType.includes(type)
            ? selectedType.filter((t) => t !== type)
            : [...selectedType, type]
        setSelectedType(newType)
        onFiltersChange({ status: selectedStatus, type: newType })
    }

    const clearFilters = () => {
        setSelectedStatus([])
        setSelectedType([])
        onFiltersChange({ status: [], type: [] })
    }

    const hasFilters = selectedStatus.length > 0 || selectedType.length > 0

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        Status
                        {selectedStatus.length > 0 && (
                            <>
                                <Separator orientation="vertical" className="mx-2 h-4" />
                                <Badge
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal lg:hidden"
                                >
                                    {selectedStatus.length}
                                </Badge>
                                <div className="hidden space-x-1 lg:flex">
                                    {selectedStatus.length > 2 ? (
                                        <Badge
                                            variant="secondary"
                                            className="rounded-sm px-1 font-normal"
                                        >
                                            {selectedStatus.length} selected
                                        </Badge>
                                    ) : (
                                        selectedStatus.map((status) => (
                                            <Badge
                                                variant="secondary"
                                                key={status}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {status}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={selectedStatus.includes("active")}
                        onCheckedChange={() => handleStatusChange("active")}
                    >
                        Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={selectedStatus.includes("inactive")}
                        onCheckedChange={() => handleStatusChange("inactive")}
                    >
                        Inactive
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 border-dashed">
                        Type
                        {selectedType.length > 0 && (
                            <>
                                <Separator orientation="vertical" className="mx-2 h-4" />
                                <Badge
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal lg:hidden"
                                >
                                    {selectedType.length}
                                </Badge>
                                <div className="hidden space-x-1 lg:flex">
                                    {selectedType.length > 2 ? (
                                        <Badge
                                            variant="secondary"
                                            className="rounded-sm px-1 font-normal"
                                        >
                                            {selectedType.length} selected
                                        </Badge>
                                    ) : (
                                        selectedType.map((type) => (
                                            <Badge
                                                variant="secondary"
                                                key={type}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {type === "percentage" ? "Percentage" : "Fixed Amount"}
                                            </Badge>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={selectedType.includes("percentage")}
                        onCheckedChange={() => handleTypeChange("percentage")}
                    >
                        Percentage
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={selectedType.includes("fixed")}
                        onCheckedChange={() => handleTypeChange("fixed")}
                    >
                        Fixed Amount
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {hasFilters && (
                <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="h-8 px-2 lg:px-3"
                >
                    Reset
                    <Check className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    )
}
