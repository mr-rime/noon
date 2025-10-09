import { useState } from "react"
import { Filter, X } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { BANNER_PLACEMENTS } from "../../../../types/banner"

interface BannerFiltersProps {
  onFiltersChange: (filters: {
    placement: string[]
    status: string[]
  }) => void
}

export function BannerFilters({ onFiltersChange }: BannerFiltersProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    placement: [] as string[],
    status: [] as string[]
  })

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "scheduled", label: "Scheduled" },
    { value: "expired", label: "Expired" }
  ]

  const handlePlacementChange = (value: string, checked: boolean) => {
    const newPlacement = checked
      ? [...filters.placement, value]
      : filters.placement.filter(p => p !== value)

    const newFilters = { ...filters, placement: newPlacement }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleStatusChange = (value: string, checked: boolean) => {
    const newStatus = checked
      ? [...filters.status, value]
      : filters.status.filter(s => s !== value)

    const newFilters = { ...filters, status: newStatus }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const newFilters = { placement: [], status: [] }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const activeFilterCount = filters.placement.length + filters.status.length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Filters</h4>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>


          <div className="space-y-2">
            <Label className="text-sm font-medium">Status</Label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={filters.status.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleStatusChange(option.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`status-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>


          <div className="space-y-2">
            <Label className="text-sm font-medium">Placement</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {BANNER_PLACEMENTS.map((placement) => (
                <div key={placement.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`placement-${placement.value}`}
                    checked={filters.placement.includes(placement.value)}
                    onCheckedChange={(checked) =>
                      handlePlacementChange(placement.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`placement-${placement.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {placement.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="admin"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
