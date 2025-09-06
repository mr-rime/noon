import { useState } from "react"
import {
    LayoutDashboard,
    Package,
    Megaphone,
    ShoppingCart,
    Users,
    BarChart3,
    Settings,
    ChevronDown,
    ChevronRight,
} from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "../ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"



const navigation = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        icon: Package,
        items: [
            { title: "All Products", url: "/products" },
            { title: "Add New Product", url: "/products/new" },
            { title: "Categories & Tags", url: "/categories" },
        ],
    },
    {
        title: "Marketing",
        icon: Megaphone,
        items: [
            { title: "Advertisement Banners", url: "/banners" },
            { title: "Coupons", url: "/coupons" },
            { title: "Discounts", url: "/discounts" },
            { title: "Product Offers", url: "/offers" },
        ],
    },
    {
        title: "Orders",
        icon: ShoppingCart,
        items: [
            { title: "All Orders", url: "/orders" },
            { title: "Delivery Management", url: "/delivery" },
            { title: "Tracking", url: "/tracking" },
            { title: "Returns", url: "/returns" },
        ],
    },
    {
        title: "Customers",
        url: "/customers",
        icon: Users,
    },
    {
        title: "Reports & Analytics",
        url: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]

export function AdminSidebar() {
    const { state } = useSidebar()
    const collapsed = state === "collapsed"
    const location = useLocation()
    const currentPath = location.pathname

    const [openGroups, setOpenGroups] = useState<string[]>(["Products", "Marketing", "Orders"])

    const isActive = (path: string) => currentPath === path
    const isGroupActive = (items: { url: string }[]) =>
        items.some(item => currentPath === item.url)

    const toggleGroup = (title: string) => {
        setOpenGroups(prev =>
            prev.includes(title)
                ? prev.filter(g => g !== title)
                : [...prev, title]
        )
    }

    const getNavClassName = (active: boolean) =>
        active
            ? "bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-primary font-medium"
            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

    return (
        <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-sidebar-border border-r bg-sidebar`}>
            <SidebarContent className="px-3 py-4">
                <div className="mb-6 px-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                            <Package className="h-4 w-4 text-white" />
                        </div>
                        {!collapsed && (
                            <div>
                                <h2 className="font-bold text-lg text-sidebar-foreground">Admin Panel</h2>
                                <p className="text-muted-foreground text-xs">E-commerce Dashboard</p>
                            </div>
                        )}
                    </div>
                </div>

                <SidebarGroup>
                    <SidebarMenu className="space-y-1">
                        {navigation.map((item) => {
                            if (item.items) {
                                const isGroupOpen = openGroups.includes(item.title)
                                const isGroupSelected = isGroupActive(item.items)

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <Collapsible open={isGroupOpen} onOpenChange={() => toggleGroup(item.title)}>
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton
                                                    className={`w-full justify-between ${getNavClassName(isGroupSelected)}`}
                                                    size={collapsed ? "sm" : "default"}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className="h-4 w-4" />
                                                        {!collapsed && <span>{item.title}</span>}
                                                    </div>
                                                    {!collapsed && (
                                                        isGroupOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            {!collapsed && (
                                                <CollapsibleContent>
                                                    <SidebarMenuSub className="mt-1 ml-6 space-y-1">
                                                        {item.items.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.url}>
                                                                <SidebarMenuSubButton asChild>
                                                                    <Link
                                                                        to={subItem.url}
                                                                        className={getNavClassName(isActive(subItem.url))}
                                                                    >
                                                                        <span className="text-sm">{subItem.title}</span>
                                                                    </Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            )}
                                        </Collapsible>
                                    </SidebarMenuItem>
                                )
                            }

                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild size={collapsed ? "sm" : "default"}>
                                        <Link
                                            to={item.url!}
                                            className={getNavClassName(isActive(item.url!))}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {!collapsed && <span>{item.title}</span>}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}