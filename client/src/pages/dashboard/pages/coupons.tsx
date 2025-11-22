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
import { CouponFilters } from "../components/coupons/coupon-filters"
import { CouponForm } from "../components/coupons/coupon-form"
import { GET_COUPONS, DELETE_COUPON } from "@/graphql/coupon"
import { toast } from "sonner"

export function CouponsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState<any>({})
    const [page, setPage] = useState(0)
    const [limit] = useState(10)
    const [selectedCoupon, setSelectedCoupon] = useState<any>(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; coupon: any }>({
        isOpen: false,
        coupon: null
    })

    const { data, loading, error, refetch } = useQuery(GET_COUPONS, {
        variables: {
            limit,
            offset: page * limit,
            search: searchTerm
        },
        fetchPolicy: "cache-and-network"
    })

    const [deleteCouponMutation] = useMutation(DELETE_COUPON, {
        onCompleted: () => {
            setDeleteDialog({ isOpen: false, coupon: null })
            refetch()
            toast("Coupon deleted successfully")
        },
        onError: () => {
            toast.error("Failed to delete coupon")
        }
    })

    const coupons = data?.getCoupons?.coupons || []
    const total = data?.getCoupons?.total || 0
    const totalPages = Math.ceil(total / limit)

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setPage(0)
    }

    const handleFiltersChange = (newFilters: any) => {
        setFilters(newFilters)
        setPage(0)
    }

    const handleCreateCoupon = () => {
        setSelectedCoupon(null)
        setIsFormOpen(true)
    }

    const handleEditCoupon = (coupon: any) => {
        setSelectedCoupon(coupon)
        setIsFormOpen(true)
    }

    const handleDeleteCoupon = (coupon: any) => {
        setDeleteDialog({ isOpen: true, coupon })
    }

    const confirmDelete = async () => {
        if (deleteDialog.coupon) {
            await deleteCouponMutation({
                variables: { id: deleteDialog.coupon.id }
            })
        }
    }

    const getStatus = (coupon: any) => {
        const now = new Date()
        const startsAt = new Date(coupon.starts_at)
        const endsAt = new Date(coupon.ends_at)

        if (coupon.status === 'inactive') {
            return { label: "Inactive", variant: "secondary" as const }
        }

        if (now < startsAt) {
            return { label: "Upcoming", variant: "secondary" as const }
        } else if (now > endsAt) {
            return { label: "Expired", variant: "destructive" as const }
        } else if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return { label: "Depleted", variant: "destructive" as const }
        } else {
            return { label: "Active", variant: "default" as const }
        }
    }

    const filteredCoupons = coupons.filter((coupon: any) => {
        if (filters.status?.length > 0) {
            const status = getStatus(coupon)
            if (!filters.status.includes(status.label.toLowerCase()) && !filters.status.includes(coupon.status)) {
                return false
            }
        }

        if (filters.type?.length > 0 && !filters.type.includes(coupon.type)) {
            return false
        }

        return true
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">
                        Manage discount coupons and promotional codes
                    </p>
                </div>
                <Button onClick={handleCreateCoupon} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Coupon
                </Button>
            </div>

            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {coupons.filter((c: any) => getStatus(c).label === "Active").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expired Coupons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {coupons.filter((c: any) => getStatus(c).label === "Expired").length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Coupons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {coupons.filter((c: any) => getStatus(c).label === "Upcoming").length}
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
                                        placeholder="Search coupons by code..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <CouponFilters onFiltersChange={handleFiltersChange} />
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
                    <CardTitle>All Coupons</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Loading coupons...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-600">
                            Error loading coupons: {error.message}
                        </div>
                    ) : filteredCoupons.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No coupons found. Create your first coupon to get started.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table className="table-fixed w-full min-w-[800px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="max-w-[200px]">Code</TableHead>
                                        <TableHead className="w-[140px]">Type</TableHead>
                                        <TableHead className="w-[100px]">Value</TableHead>
                                        <TableHead className="w-[100px]">Usage</TableHead>
                                        <TableHead className="w-[100px]">Status</TableHead>
                                        <TableHead className="w-[120px]">Start Date</TableHead>
                                        <TableHead className="w-[120px]">End Date</TableHead>
                                        <TableHead className="w-[60px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCoupons.map((coupon: any) => {
                                        const status = getStatus(coupon)

                                        return (
                                            <TableRow key={coupon.id}>
                                                <TableCell className="font-medium">
                                                    {coupon.code}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {coupon.type === "percentage" ? "Percentage" : "Fixed Amount"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {coupon.type === "percentage" ? `${coupon.value}%` : `${coupon.value}`}
                                                </TableCell>
                                                <TableCell>
                                                    {coupon.used_count} / {coupon.usage_limit || "∞"}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={status.variant}>
                                                        {status.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {coupon.starts_at ? new Date(coupon.starts_at).toLocaleDateString() : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    {coupon.ends_at ? new Date(coupon.ends_at).toLocaleDateString() : "N/A"}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem onClick={() => handleEditCoupon(coupon)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDeleteCoupon(coupon)}>
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

            <CouponForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                coupon={selectedCoupon}
                onSuccess={() => refetch()}
            />

            <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open, coupon: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Coupon</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this coupon? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ isOpen: false, coupon: null })}>
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
