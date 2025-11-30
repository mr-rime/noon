import { useEffect } from "react"
import { useMutation } from "@apollo/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { CREATE_COUPON, UPDATE_COUPON } from "@/shared/api/coupon"
import { toast } from "sonner"


const couponSchema = z.object({
    code: z.string().min(3, "Code must be at least 3 characters").max(50),
    type: z.enum(["percentage", "fixed"]),
    value: z.coerce.number().positive("Value must be positive"),
    starts_at: z.string().min(1, "Start date is required"),
    ends_at: z.string().min(1, "End date is required"),
    usage_limit: z.coerce.number().optional(),
    status: z.enum(["active", "inactive"]),
})

type CouponFormValues = z.infer<typeof couponSchema>

interface CouponFormProps {
    isOpen: boolean
    onClose: () => void
    coupon?: any
    onSuccess: () => void
}

export function CouponForm({ isOpen, onClose, coupon, onSuccess }: CouponFormProps) {
    const [createCoupon, { loading: creating }] = useMutation(CREATE_COUPON)
    const [updateCoupon, { loading: updating }] = useMutation(UPDATE_COUPON)

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema),
        defaultValues: {
            code: "",
            type: "percentage",
            value: 0,
            starts_at: "",
            ends_at: "",
            usage_limit: undefined,
            status: "active",
        },
    })

    useEffect(() => {
        if (coupon) {
            form.reset({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                starts_at: new Date(coupon.starts_at).toISOString().slice(0, 16),
                ends_at: new Date(coupon.ends_at).toISOString().slice(0, 16),
                usage_limit: coupon.usage_limit,
                status: coupon.status,
            })
        } else {
            form.reset({
                code: "",
                type: "percentage",
                value: 0,
                starts_at: "",
                ends_at: "",
                usage_limit: undefined,
                status: "active",
            })
        }
    }, [coupon, form, isOpen])

    const onSubmit = async (data: CouponFormValues) => {
        try {
            if (coupon) {
                await updateCoupon({
                    variables: {
                        id: coupon.id,
                        input: data,
                    },
                })
                toast("Coupon updated successfully")
            } else {
                await createCoupon({
                    variables: {
                        input: data,
                    },
                })
                toast("Coupon created successfully")
            }
            onSuccess()
            onClose()
        } catch (error: any) {
            toast.error(error.message || "Something went wrong")
        }
    }

    const isLoading = creating || updating

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{coupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
                    <DialogDescription>
                        {coupon
                            ? "Update the coupon details below."
                            : "Create a new coupon code for your customers."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="SUMMER2024" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="percentage">Percentage</SelectItem>
                                                <SelectItem value="fixed">Fixed Amount</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="starts_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="ends_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="usage_limit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usage Limit (Optional)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {coupon ? "Update Coupon" : "Create Coupon"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
