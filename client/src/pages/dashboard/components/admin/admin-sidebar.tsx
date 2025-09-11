import { useState, useEffect } from "react"
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
import { cn } from "@/utils/cn"

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
            { title: "All Products", url: "/d/products" },
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
    const [isTransitioning, setIsTransitioning] = useState(false)

    // Add transition state management for smoother animations
    useEffect(() => {
        setIsTransitioning(true)
        const timer = setTimeout(() => setIsTransitioning(false), 100)
        return () => clearTimeout(timer)
    }, [collapsed])

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
            ? "bg-sidebar-accent text-sidebar-accent-foreground border-r-2 border-primary font-medium transition-colors duration-75"
            : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-colors duration-75"

    return (
        <Sidebar
            className={cn(
                "border-r border-sidebar-border bg-sidebar transition-all duration-100 ease-out",
                collapsed ? "w-16" : "w-64",
                isTransitioning && "will-change-transform"
            )}
        >
            <SidebarContent className="px-3 py-4">
                <div className="mb-6 px-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-white" />
                        </div>
                        {!collapsed && (
                            <div className="transition-opacity duration-75 ease-out">
                                <h2 className="text-lg font-bold text-sidebar-foreground whitespace-nowrap">Admin Panel</h2>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">E-commerce Dashboard</p>
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
                                                    className={cn(
                                                        "w-full justify-between",
                                                        getNavClassName(isGroupSelected)
                                                    )}
                                                    size={collapsed ? "sm" : "default"}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <item.icon className="w-4 h-4 flex-shrink-0" />
                                                        {!collapsed && (
                                                            <span className="transition-opacity duration-75 ease-out whitespace-nowrap">
                                                                {item.title}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {!collapsed && (
                                                        <div className="transition-transform duration-75 ease-out">
                                                            {isGroupOpen ?
                                                                <ChevronDown className="w-4 h-4" /> :
                                                                <ChevronRight className="w-4 h-4" />
                                                            }
                                                        </div>
                                                    )}
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>
                                            {!collapsed && (
                                                <CollapsibleContent className="transition-all duration-75 ease-out">
                                                    <SidebarMenuSub className="ml-6 mt-1 space-y-1">
                                                        {item.items.map((subItem) => (
                                                            <SidebarMenuSubItem key={subItem.url}>
                                                                <SidebarMenuSubButton asChild>
                                                                    <Link
                                                                        to={subItem.url}
                                                                        className={getNavClassName(isActive(subItem.url))}
                                                                    >
                                                                        <span className="text-sm whitespace-nowrap">{subItem.title}</span>
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
                                            <item.icon className="w-4 h-4 flex-shrink-0" />
                                            {!collapsed && (
                                                <span className="transition-opacity duration-75 ease-out whitespace-nowrap">
                                                    {item.title}
                                                </span>
                                            )}
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