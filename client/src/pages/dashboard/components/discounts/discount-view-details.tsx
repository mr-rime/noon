import { useState } from "react"
import { Calendar, Package, Percent, Clock, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

interface DiscountViewDetailsProps {
    discount: any
    onEdit: () => void
    onDelete: () => void
}

export function DiscountViewDetails({ discount, onEdit, onDelete }: DiscountViewDetailsProps) {
    const [isOpen, setIsOpen] = useState(false)

    const getStatus = () => {
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

    const calculateDiscountAmount = () => {
        if (!discount.product_price) return 0

        if (discount.type === "percentage") {
            return (discount.product_price * discount.value) / 100
        } else {
            return discount.value
        }
    }

    const calculateFinalPrice = () => {
        if (!discount.product_price) return 0

        if (discount.type === "percentage") {
            return discount.product_price - (discount.product_price * discount.value) / 100
        } else {
            return Math.max(discount.product_price - discount.value, 0)
        }
    }

    const status = getStatus()

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="h-8 w-8 p-0"
            >
                <Eye className="h-4 w-4" />
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Percent className="h-5 w-5" />
                                Discount Details
                            </div>
                            <Badge variant={status.variant}>
                                {status.label}
                            </Badge>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Product Information */}
                        <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Product Information
                            </h4>
                            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-sm text-muted-foreground">Product Name:</span>
                                    <span className="font-medium break-words text-right sm:text-left">{discount.product_name || "N/A"}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-sm text-muted-foreground">SKU:</span>
                                    <span className="font-mono text-sm text-right sm:text-left">{discount.psku || "N/A"}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                    <span className="text-sm text-muted-foreground">Original Price:</span>
                                    <span className="font-medium text-right sm:text-left">
                                        {discount.currency} {discount.product_price || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Discount Information */}
                        <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <Percent className="h-4 w-4" />
                                Discount Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Type:</span>
                                        <Badge variant="outline">
                                            {discount.type === "percentage" ? "Percentage" : "Fixed Amount"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Value:</span>
                                        <span className="font-medium">
                                            {discount.type === "percentage" ? `${discount.value}%` : `${discount.currency} ${discount.value}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Discount Amount:</span>
                                        <span className="font-medium text-red-600">
                                            -{discount.currency} {calculateDiscountAmount().toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Final Price:</span>
                                        <span className="font-medium text-green-600">
                                            {discount.currency} {calculateFinalPrice().toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Date Information */}
                        <div className="space-y-3">
                            <h4 className="font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Date Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Start Date</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {discount.starts_at ? new Date(discount.starts_at).toLocaleString() : "N/A"}
                                    </div>
                                </div>
                                <div className="p-4 bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">End Date</span>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {discount.ends_at ? new Date(discount.ends_at).toLocaleString() : "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Duration */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">Duration:</span>
                                <span className="text-sm text-blue-700">
                                    {discount.starts_at && discount.ends_at ? (
                                        <>
                                            {Math.ceil((new Date(discount.ends_at).getTime() - new Date(discount.starts_at).getTime()) / (1000 * 60 * 60 * 24))} days
                                        </>
                                    ) : "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    onDelete()
                                    setIsOpen(false)
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                            <Button
                                onClick={() => {
                                    onEdit()
                                    setIsOpen(false)
                                }}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
