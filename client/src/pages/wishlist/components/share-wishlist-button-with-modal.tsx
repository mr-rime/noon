import { useState } from 'react'
import { ShareWishlistModal } from './share-wishlist-modal'
import type { WishlistType } from '../types'
import { wishlist_icons } from '../constants'

export function ShareWishlistButtonWithModal({ currentWishlist }: { currentWishlist: WishlistType | undefined }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex cursor-pointer items-center gap-3 rounded-full border border-[#ebecf0] px-[30px] py-[6px]">
                <span>{wishlist_icons.shareIcon}</span>
                <span className="font-bold text-[14px]">Share</span>
            </button>
            <ShareWishlistModal isOpen={isOpen} onClose={() => setIsOpen(false)} wishlist={currentWishlist} />
        </>
    )
}


