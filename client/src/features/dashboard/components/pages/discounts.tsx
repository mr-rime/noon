import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Plus, Search, MoreHorizontal, Edit, Trash2, RefreshCw } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { DiscountFilters } from "../components/discounts/discount-filters"
import { DiscountForm } from "../components/discounts/discount-form"
import { GET_DISCOUNTS, DELETE_DISCOUNT } from "@/shared/api/discount"

export function DiscountsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<any>({})
    const [page, setPage] = useState(0)
    const [limit] = useState(10)
    const [selectedDiscount, setSelectedDiscount] = useState<any>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; discount: any }>({
        isOpen: false,
        discount: null
    })

    const { data, loading, error, refetch } = useQuery(GET_DISCOUNTS, {
        variables: {
            limit,
            offset: page * limit,
            search: searchTerm,
            productId: null
        },
        fetchPolicy: "cache-and-network"
    })

    const [deleteDiscountMutation] = useMutation(DELETE_DISCOUNT, {
        onCompleted: () => {
            setDeleteDialog({ isOpen: false, discount: null })
            refetch()
        }
    })

    const discounts = data?.getDiscounts?.discounts || []
    const total = data?.getDiscounts?.total || 0
    const totalPages = Math.ceil(total / limit)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setPage(0)
    }

    const handleFiltersChange = (newFilters: any) => {
        setFilters(newFilters)
        setPage(0)
    }

    const handleCreateDiscount = () => {
        setSelectedDiscount(null)
        setIsFormOpen(true)
    }

    const handleEditDiscount = (discount: any) => {
        setSelectedDiscount(discount)
        setIsFormOpen(true)
    }

    const handleDeleteDiscount = (discount: any) => {
        setDeleteDialog({ isOpen: true, discount })
    }

    const confirmDelete = async () => {
        if (deleteDialog.discount) {
            await deleteDiscountMutation({
                variables: { id: deleteDialog.discount.id }
            })
        }
    }

    const getStatus = (discount: any) => {
        const now = new Date()
        const startsAt = new Date(discount.starts_at)
        const endsAt = new Date(discount.ends_at)

        if (now < startsAt) {
            return { label: "Upcoming", variant: "secondary" as const }
        } else if (now > endsAt) {
            return { label: "Expired", variant: "destructive" as const }
        } else {
            return { label: "Active", variant: "default" as const }
        }
    }

    const calculateFinalPrice = (discount: any) => {
        if (!discount.product_price) return 0

        if (discount.type === "percentage") {
            return discount.product_price - (discount.product_price * discount.value) / 100
        } else {
            return Math.max(discount.product_price - discount.value, 0)
        }
    }

    const filteredDiscounts = discounts.filter((discount: any) => {

        if (filters.status?.length > 0) {
            const status = getStatus(discount)
            if (!filters.status.includes(status.label.toLowerCase())) {
                return false
            }
        }


        if (filters.type?.length > 0 && !filters.type.includes(discount.type)) {
            return false
        }


        if (filters.timeRange?.length > 0) {
            const now = new Date()
            const discountDate = new Date(discount.starts_at)

            const shouldInclude = filters.timeRange.some((range: string) => {
                switch (range) {
                    case "today": {
                        return discountDate.toDateString() === now.toDateString()
                    }
                    case "week": {
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                        return discountDate >= weekAgo
                    }
                    case "month": {
                        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
                        return discountDate >= monthAgo
                    }
                    case "year": {
                        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
                        return discountDate >= yearAgo
                    }
                    default:
                        return true
                }
            })

            if (!shouldInclude) return false
        }

        return true
    })

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Discounts</h1>
                    <p className="text-muted-foreground">
                        Manage product discounts and promotional offers
                    </p>
                </div>
                <Button onClick={handleCreateDiscount} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Discount
                </Button>
            </div>


            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Discounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Discounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {discounts.filter((d: any) => getStatus(d).label === "Active").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expired Discounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {discounts.filter((d: any) => getStatus(d).label === "Expired").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Discounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {discounts.filter((d: any) => getStatus(d).label === "Upcoming").length}
                        </div>
                    </CardContent>
                </Card>
            </div>


            <Card>
                <CardHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                    <Input
                                        placeholder="Search discounts by product name or SKU..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <DiscountFilters onFiltersChange={handleFiltersChange} />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => refetch()}
                                    disabled={loading}
                                >
                                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>All Discounts</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Loading discounts...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">
                            Error loading discounts: {error.message}
                        </div>
                    ) : filteredDiscounts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No discounts found. Create your first discount to get started.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table className="table-fixed w-full min-w-[800px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="max-w-[300px]">Product</TableHead>
                                        <TableHead className="w-[140px]">Discount Type</TableHead>
                                        <TableHead className="w-[100px]">Value</TableHead>
                                        <TableHead className="w-[120px]">Original Price</TableHead>
                                        <TableHead className="w-[120px]">Final Price</TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead className="w-[120px]">Start Date</TableHead>
                                        <TableHead className="w-[120px]">End Date</TableHead>
                                        <TableHead className="w-[60px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDiscounts.map((discount: any) => {
                                        const status = getStatus(discount)
                                        const finalPrice = calculateFinalPrice(discount)

                                        return (
                                            <TableRow key={discount.id}>
                                                <TableCell className="max-w-[300px]">
                                                    <div className="min-w-0">
                                                        <div className="font-medium truncate" title={discount.product_name || "N/A"}>
                                                            {discount.product_name || "N/A"}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground truncate">
                                                            SKU: {discount.psku || "N/A"}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {discount.type === "percentage" ? "Percentage" : "Fixed Amount"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {discount.type === "percentage" ? `${discount.value}%` : `${discount.currency} ${discount.value}`}
                                                </TableCell>
                                                <TableCell>
                                                    {discount.currency} {discount.product_price || "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="font-medium text-green-600">
                                                        {discount.currency} {finalPrice.toFixed(2)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={status.variant}>
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {discount.starts_at ? new Date(discount.starts_at).toLocaleDateString() : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {discount.ends_at ? new Date(discount.ends_at).toLocaleDateString() : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditDiscount(discount)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteDiscount(discount)}>
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>


            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page + 1} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        Next
                    </Button>
                </div>
            )}


            <DiscountForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                discount={selectedDiscount}
                onSuccess={() => refetch()}
            />


            <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open, discount: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Discount</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this discount? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false, discount: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
