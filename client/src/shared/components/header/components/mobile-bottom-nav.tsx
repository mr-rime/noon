import { useLocation, useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { header_icons } from '../constants/icons'
import { LoginButtonWithModalDialog } from '@/shared/components/login-modal'
import { cn } from '@/shared/utils/cn'
import type { GetUserResponse } from '@/shared/types'
import { User } from 'lucide-react'

interface MobileBottomNavProps {
    cartCount: number
    isVisible: boolean
    onCategoriesClick: () => void
    user?: GetUserResponse['getUser']['user'] | null
}

const tabClasses = 'flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium'

export function MobileBottomNav({ cartCount, isVisible, onCategoriesClick, user }: MobileBottomNavProps) {
    const navigate = useNavigate()
    const location = useLocation()
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null)

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setPortalTarget(document.body)
        }
    }, [])

    if (!isVisible || !portalTarget) return null

    const goHome = () => navigate({ to: '/' })
    const goCart = () => navigate({ to: '/cart' })
    const goProfile = () => navigate({ to: '/profile' })

    const isActive = (path: string) => location.pathname === path

    const renderAccountTab = (content: ReactNode) =>
        user ? (
            <button type="button" className={cn(tabClasses, isActive('/profile') && 'text-[#343741] font-semibold')} onClick={goProfile}>
                {content}
                <span>My Account</span>
            </button>
        ) : (
            <LoginButtonWithModalDialog>
                {({ open }) => (
                    <button type="button" className={tabClasses} onClick={open}>
                        {content}
                        <span>Sign In</span>
                    </button>
                )}
            </LoginButtonWithModalDialog>
        )

    const content = (
        <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-gray-200 bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.05)] md:hidden">
            <div className="flex h-[64px] items-center justify-between px-1 text-[#6f7285]">
                <button
                    type="button"
                    className={cn(tabClasses, isActive('/') && 'text-[#343741] font-semibold')}
                    onClick={goHome}>
                    {header_icons.homeIcon}
                    <span>Home</span>
                </button>

                <button type="button" className={tabClasses} onClick={onCategoriesClick}>
                    {header_icons.categoriesIcon}
                    <span>Categories</span>
                </button>

                {renderAccountTab(<User size={24} />)}

                <button
                    type="button"
                    className={cn(tabClasses, isActive('/cart') && 'text-[#343741] font-semibold')}
                    onClick={goCart}>
                    <div className="relative">
                        {header_icons.cartIcon}
                        {cartCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-[#3866DF] px-1 text-[10px] text-white">
                                {cartCount}
                            </span>
                        )}
                    </div>
                    <span>Cart</span>
                </button>
            </div>
        </nav>
    )

    return createPortal(content, portalTarget)
}
