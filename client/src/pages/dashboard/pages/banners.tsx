import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client"
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Megaphone,
    Loader2,
    AlertCircle,
    Calendar,
    ExternalLink,
    Image
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown"
import { Switch } from "../components/ui/switch"
import { BannerForm } from "../components/banners/banner-form"
import { BannerViewDetails } from "../components/banners/banner-view-details"
import { BannerFilters } from "../components/banners/banner-filters"
import { Pagination } from "../components/ui/pagination"
import { GET_BANNERS, DELETE_BANNER, TOGGLE_BANNER_STATUS } from "../../../graphql/banner"
import type { Banner } from "../../../types/banner"
import { getBannerPlacementLabel } from "../../../types/banner"
import { toast } from "sonner"
import { DeleteConfirmationModal } from "../components/ui/delete-confirmation-modal"

const ITEMS_PER_PAGE = 10

export default function Banners() {
    const [searchTerm, setSearchTerm] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [viewingBanner, setViewingBanner] = useState<string | null>(null)
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
    const [creatingBanner, setCreatingBanner] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [filters, setFilters] = useState({
        placement: [] as string[],
        status: [] as string[]
    })
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        bannerId: string | null
        bannerName: string | null
    }>({
        isOpen: false,
        bannerId: null,
        bannerName: null
    })


    const { data, loading, error, refetch } = useQuery(GET_BANNERS, {
        variables: {
            limit: ITEMS_PER_PAGE,
            offset: (currentPage - 1) * ITEMS_PER_PAGE,
            search: searchQuery
        },
        fetchPolicy: 'cache-and-network'
    })


    const [deleteBannerMutation, { loading: deleting }] = useMutation(DELETE_BANNER, {
        onCompleted: (data) => {
            if (data.deleteBanner.success) {
                toast.success(data.deleteBanner.message || 'Banner deleted successfully')
                refetch()
            } else {
                toast.error(data.deleteBanner.message || 'Failed to delete banner')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to delete banner')
        }
    })


    const [toggleStatus, { loading: toggling }] = useMutation(TOGGLE_BANNER_STATUS, {
        onCompleted: (data) => {
            if (data.toggleBannerStatus.success) {
                toast.success('Banner status updated')
                refetch()
            } else {
                toast.error(data.toggleBannerStatus.message || 'Failed to update status')
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to update status')
        }
    })

    const banners = data?.getBanners?.banners || []
    const total = data?.getBanners?.total || 0
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE)


    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(searchTerm)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchTerm])


    const filteredBanners = banners.filter((banner: Banner) => {
        let matchesPlacement = true
        let matchesStatus = true


        if (filters.placement.length > 0) {
            matchesPlacement = filters.placement.includes(banner.placement)
        }


        if (filters.status.length > 0) {
            const now = new Date()
            const startDate = new Date(banner.start_date)
            const endDate = new Date(banner.end_date)

            const status = !banner.is_active ? 'inactive' :
                now < startDate ? 'scheduled' :
                    now > endDate ? 'expired' : 'active'

            matchesStatus = filters.status.includes(status)
        }

        return matchesPlacement && matchesStatus
    })

    const getBannerStatus = (banner: Banner) => {
        const now = new Date()
        const startDate = new Date(banner.start_date)
        const endDate = new Date(banner.end_date)

        if (!banner.is_active) {
            return { label: "Inactive", variant: "secondary" as const }
        } else if (now < startDate) {
            return { label: "Scheduled", variant: "default" as const }
        } else if (now > endDate) {
            return { label: "Expired", variant: "destructive" as const }
        } else {
            return { label: "Active", variant: "success" as const }
        }
    }

    const formatDate = (date: string) => {
        if (!date) return "N/A"
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })
    }

    const handleViewBanner = (bannerId: string) => {
        setViewingBanner(bannerId)
    }

    const handleEditBanner = (banner: Banner) => {
        setEditingBanner(banner)
        setViewingBanner(null)
    }

    const handleCloseModals = () => {
        setViewingBanner(null)
        setEditingBanner(null)
        setCreatingBanner(false)
    }

    const handleFormSuccess = () => {
        handleCloseModals()
        refetch()
    }

    const handleDeleteBanner = (bannerId: string, bannerName: string) => {
        setDeleteModal({
            isOpen: true,
            bannerId,
            bannerName
        })
    }

    const handleConfirmDelete = async () => {
        if (!deleteModal.bannerId) return

        await deleteBannerMutation({ variables: { id: deleteModal.bannerId } })
        setDeleteModal({ isOpen: false, bannerId: null, bannerName: null })
    }

    const handleCloseDeleteModal = () => {
        setDeleteModal({ isOpen: false, bannerId: null, bannerName: null })
    }

    const handleToggleStatus = async (bannerId: string) => {
        await toggleStatus({ variables: { id: bannerId } })
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className="space-y-4 md:space-y-6 p-4 md:p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">Advertisement Banners</h1>
                    <p className="text-sm md:text-base text-muted-foreground">Manage promotional banners and advertisements</p>
                </div>
                <Button
                    variant="admin"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => setCreatingBanner(true)}
                >
                    <Plus className="h-4 w-4" />
                    Add New Banner
                </Button>
            </div>


            <Card className="shadow-card">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search banners by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <BannerFilters onFiltersChange={setFilters} />
                    </div>
                </CardContent>
            </Card>


            <Card className="shadow-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <Megaphone className="h-5 w-5 text-primary" />
                        All Banners ({total})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 md:p-6">
                    {loading && !data ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <AlertCircle className="h-12 w-12 text-destructive" />
                            <p className="text-muted-foreground">Failed to load banners</p>
                            <Button onClick={() => refetch()} variant="outline">Retry</Button>
                        </div>
                    ) : filteredBanners.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Megaphone className="h-12 w-12 text-muted-foreground" />
                            <p className="text-muted-foreground">No banners found</p>
                            <Button onClick={() => setCreatingBanner(true)} variant="outline">
                                Create your first banner
                            </Button>
                        </div>
                    ) : (
                        <>

                            <div className="hidden md:block overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Banner</TableHead>
                                            <TableHead>Placement</TableHead>
                                            <TableHead>Campaign Period</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Active</TableHead>
                                            <TableHead className="w-[50px]">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBanners.map((banner: Banner) => {
                                            const status = getBannerStatus(banner)

                                            return (
                                                <TableRow key={banner.id} className="hover:bg-muted/30">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3 min-w-[250px]">
                                                            <div className="w-16 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                {banner.image_url ? (
                                                                    <img
                                                                        src={banner.image_url}
                                                                        alt={banner.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            (e.target as HTMLImageElement).style.display = 'none'
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Image className="h-6 w-6 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <p className="font-medium truncate" title={banner.name}>{banner.name}</p>
                                                                {banner.target_url && (
                                                                    <a
                                                                        href={banner.target_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        View target
                                                                        <ExternalLink className="h-3 w-3" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium">
                                                                {getBannerPlacementLabel(banner.placement)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{banner.placement}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="text-sm space-y-1">
                                                            <div className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(banner.start_date)}
                                                            </div>
                                                            <div className="text-muted-foreground">
                                                                to {formatDate(banner.end_date)}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={status.variant}>
                                                            {status.label}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Switch
                                                            checked={banner.is_active}
                                                            onCheckedChange={() => handleToggleStatus(banner.id)}
                                                            disabled={toggling}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" disabled={deleting}>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleViewBanner(banner.id)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditBanner(banner)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Banner
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteBanner(banner.id, banner.name)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
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


                            <div className="md:hidden space-y-4 p-4">
                                {filteredBanners.map((banner: Banner) => {
                                    const status = getBannerStatus(banner)

                                    return (
                                        <Card key={banner.id} className="overflow-hidden">
                                            <CardContent className="p-4">
                                                <div className="space-y-3">

                                                    <div className="flex gap-3">
                                                        <div className="w-20 h-14 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                            {banner.image_url ? (
                                                                <img
                                                                    src={banner.image_url}
                                                                    alt={banner.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).style.display = 'none'
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Image className="h-6 w-6 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-sm truncate" title={banner.name}>
                                                                {banner.name}
                                                            </h3>
                                                            <p className="text-xs text-muted-foreground truncate">
                                                                {getBannerPlacementLabel(banner.placement)}
                                                            </p>
                                                        </div>
                                                    </div>


                                                    <div className="flex items-center justify-between">
                                                        <Badge variant={status.variant} className="text-xs">
                                                            {status.label}
                                                        </Badge>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground">Active</span>
                                                            <Switch
                                                                checked={banner.is_active}
                                                                onCheckedChange={() => handleToggleStatus(banner.id)}
                                                                disabled={toggling}
                                                                className="scale-75"
                                                            />
                                                        </div>
                                                    </div>


                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{formatDate(banner.start_date)} - {formatDate(banner.end_date)}</span>
                                                    </div>


                                                    <div className="flex justify-end pt-2 border-t">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleViewBanner(banner.id)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditBanner(banner)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    className="text-destructive"
                                                                    onClick={() => handleDeleteBanner(banner.id, banner.name)}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>


                            {totalPages > 1 && (
                                <div className="mt-6 pt-6 border-t px-4 md:px-0">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        totalItems={total}
                                        itemsPerPage={ITEMS_PER_PAGE}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>


            {creatingBanner && (
                <BannerForm
                    isOpen={creatingBanner}
                    onClose={handleCloseModals}
                    onSuccess={handleFormSuccess}
                />
            )}

            {editingBanner && (
                <BannerForm
                    banner={editingBanner}
                    isOpen={!!editingBanner}
                    onClose={handleCloseModals}
                    onSuccess={handleFormSuccess}
                />
            )}

            {viewingBanner && (
                <BannerViewDetails
                    bannerId={viewingBanner}
                    onClose={handleCloseModals}
                    onEdit={() => {
                        const banner = banners.find((b: Banner) => b.id === viewingBanner)
                        if (banner) handleEditBanner(banner)
                    }}
                />
            )}


            <DeleteConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Delete Banner"
                description="Are you sure you want to delete this banner? This action cannot be undone."
                itemName={deleteModal.bannerName || undefined}
                isLoading={deleting}
            />
        </div>
    )
}
