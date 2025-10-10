import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { Calendar, Image, Link, Type, FileText, ToggleLeft, Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { CREATE_BANNER, UPDATE_BANNER } from "@/graphql/banner"
import { BANNER_PLACEMENTS, type Banner } from "@/types/banner"

interface BannerFormProps {
  banner?: Banner | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BannerForm({ banner, isOpen, onClose, onSuccess }: BannerFormProps) {
  const isEditing = !!banner
  const [formData, setFormData] = useState({
    name: "",
    placement: "",
    description: "",
    targetUrl: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    isActive: true
  })

  const [createBanner, { loading: creating }] = useMutation(CREATE_BANNER)
  const [updateBanner, { loading: updating }] = useMutation(UPDATE_BANNER)

  const loading = creating || updating

  useEffect(() => {
    if (banner) {
      const formatDate = (date: string) => {
        if (!date) return ""
        const d = new Date(date)
        return d.toISOString().slice(0, 16)
      }

      setFormData({
        name: banner.name || "",
        placement: banner.placement || "",
        description: banner.description || "",
        targetUrl: banner.target_url || "",
        imageUrl: banner.image_url || "",
        startDate: formatDate(banner.start_date),
        endDate: formatDate(banner.end_date),
        isActive: banner.is_active !== undefined ? banner.is_active : true
      })
    } else {
      const now = new Date()
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      
      setFormData({
        name: "",
        placement: "",
        description: "",
        targetUrl: "",
        imageUrl: "",
        startDate: now.toISOString().slice(0, 16),
        endDate: nextMonth.toISOString().slice(0, 16),
        isActive: true
      })
    }
  }, [banner])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.placement || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields")
      return
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error("End date must be after start date")
      return
    }

    try {
      const variables = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      }

      if (isEditing) {
        const { data } = await updateBanner({
          variables: {
            id: banner.id,
            ...variables
          }
        })

        if (data?.updateBanner?.success) {
          toast.success("Banner updated successfully")
          onSuccess()
          onClose()
        } else {
          toast.error(data?.updateBanner?.message || "Failed to update banner")
        }
      } else {
        const { data } = await createBanner({ variables })

        if (data?.createBanner?.success) {
          toast.success("Banner created successfully")
          onSuccess()
          onClose()
        } else {
          toast.error(data?.createBanner?.message || "Failed to create banner")
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
      console.error("Banner form error:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Banner" : "Create New Banner"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Banner Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter banner name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placement" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Placement Position *
              </Label>
              <Select
                value={formData.placement}
                onValueChange={(value) => setFormData({ ...formData, placement: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select banner placement" />
                </SelectTrigger>
                <SelectContent>
                  {BANNER_PLACEMENTS.map((placement) => (
                    <SelectItem key={placement.value} value={placement.value}>
                      {placement.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter banner description (optional)"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image URL
              </Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/banner-image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border bg-muted">
                  <img 
                    src={formData.imageUrl} 
                    alt="Banner preview" 
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetUrl" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Target URL
              </Label>
              <Input
                id="targetUrl"
                type="url"
                value={formData.targetUrl}
                onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                placeholder="https://example.com/products"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  End Date *
                </Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="flex items-center gap-2 cursor-pointer">
                  <ToggleLeft className="h-4 w-4" />
                  Active Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable this banner
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="admin" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Banner" : "Create Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
