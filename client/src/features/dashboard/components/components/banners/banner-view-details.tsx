import { useQuery } from "@apollo/client"
import { Calendar, ExternalLink, Link, MapPin, FileText, ToggleLeft } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { GET_BANNER } from "@/features/landing/api/banner"
import { getBannerPlacementLabel } from "@/shared/types/banner"

interface BannerViewDetailsProps {
  bannerId: string
  onClose: () => void
  onEdit: () => void
}

export function BannerViewDetails({ bannerId, onClose, onEdit }: BannerViewDetailsProps) {
  const { data, loading, error } = useQuery(GET_BANNER, {
    variables: { id: bannerId },
    skip: !bannerId
  })

  const banner = data?.getBanner

  const formatDate = (date: string) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getBannerStatus = () => {
    if (!banner) return null

    const now = new Date()
    const startDate = new Date(banner.start_date)
    const endDate = new Date(banner.end_date)

    if (!banner.is_active) {
      return <Badge variant="secondary">Inactive</Badge>
    } else if (now < startDate) {
      return <Badge variant="default">Scheduled</Badge>
    } else if (now > endDate) {
      return <Badge variant="destructive">Expired</Badge>
    } else {
      return <Badge variant="success">Active</Badge>
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Banner Details
            {banner && getBannerStatus()}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="h-8 w-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading banner details...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-muted-foreground">
            Failed to load banner details
          </div>
        )}

        {banner && (
          <div className="space-y-6">

            {banner.image_url && (
              <div className="rounded-lg overflow-hidden border bg-muted">
                <img
                  src={banner.image_url}
                  alt={banner.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}


            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Banner Name</p>
                  <p className="text-base font-semibold">{banner.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Placement</p>
                  <p className="text-base">{getBannerPlacementLabel(banner.placement)}</p>
                  <p className="text-xs text-muted-foreground mt-1">({banner.placement})</p>
                </div>
              </div>

              {banner.description && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-base">{banner.description}</p>
                  </div>
                </div>
              )}

              {banner.target_url && (
                <div className="flex items-start gap-3">
                  <Link className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Target URL</p>
                    <a
                      href={banner.target_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {banner.target_url}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Campaign Duration</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Start:</span> {formatDate(banner.start_date)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">End:</span> {formatDate(banner.end_date)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ToggleLeft className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    {getBannerStatus()}
                    <span className="text-sm text-muted-foreground">
                      {banner.is_active ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {banner.created_at && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">Created</p>
                    <p className="text-sm">{formatDate(banner.created_at)}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Banner ID</p>
                  <p className="text-xs font-mono text-muted-foreground">{banner.id}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="admin" onClick={onEdit} disabled={loading}>
            Edit Banner
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
