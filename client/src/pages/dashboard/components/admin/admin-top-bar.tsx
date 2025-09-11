import { Search, Bell, Plus, User, Settings, Package, ShoppingCart, Ticket, Tag } from "lucide-react"
import { SidebarTrigger } from "../ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"


export function AdminTopBar() {
    return (
        <div className="border-border border-b bg-background backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="h-8 w-8" />

                    <div className="relative max-w-md flex-1">
                        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products, orders, coupons..."
                            className="border-border bg-background pl-10 focus:border-primary"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="admin" size="sm" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Quick Add
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                                <Package className="h-4 w-4" />
                                Add Product
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <ShoppingCart className="h-4 w-4" />
                                Create Order
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Ticket className="h-4 w-4" />
                                New Coupon
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <Tag className="h-4 w-4" />
                                Add Category
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                                <Settings className="h-4 w-4" />
                                Bulk Import
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-4 w-4" />
                                <Badge
                                    variant="destructive"
                                    className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                                >
                                    3
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80 border-border bg-popover">
                            <DropdownMenuLabel>
                                <div className="flex items-center justify-between">
                                    <span>Notifications</span>
                                    <Badge variant="secondary" className="text-xs">3 new</Badge>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-64 overflow-y-auto">
                                <DropdownMenuItem className="flex-col items-start gap-2 p-4">
                                    <div className="flex w-full items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                                        <span className="font-medium text-sm">Low Stock Alert</span>
                                        <span className="ml-auto text-muted-foreground text-xs">2 min ago</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Wireless Headphones are running low (5 units left)</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex-col items-start gap-2 p-4">
                                    <div className="flex w-full items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-success"></div>
                                        <span className="font-medium text-sm">New Order</span>
                                        <span className="ml-auto text-muted-foreground text-xs">5 min ago</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Order #ORD-2024-006 has been placed by John Doe</p>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex-col items-start gap-2 p-4">
                                    <div className="flex w-full items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-warning"></div>
                                        <span className="font-medium text-sm">Return Request</span>
                                        <span className="ml-auto text-muted-foreground text-xs">10 min ago</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm">Customer requested return for Smart Watch</p>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-center text-primary">
                                View All Notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <User className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                <div>
                                    <p className="font-medium">Admin User</p>
                                    <p className="text-muted-foreground text-xs">admin@store.com</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                Profile Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Store Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}