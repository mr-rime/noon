import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { wishlist_icons } from '../constants'
import type { WishlistType } from '../types'
import { toast } from 'sonner'

export function ShareWishlistModal({
    isOpen,
    wishlist,
    onClose,
}: {
    isOpen: boolean
    wishlist: WishlistType | undefined
    onClose: () => void
}) {
    const shareUrl = typeof window !== 'undefined' && wishlist
        ? `${window.location.origin}/wishlist?wishlistCode=${wishlist.id}`
        : ''

    const handleCopy = async () => {
        if (!shareUrl) return
        try {
            await navigator.clipboard.writeText(shareUrl)
            toast.success('Link copied')
        } catch {
            toast.error('Failed to copy link')
        }
    }

    return isOpen ? (
        <ModalDialog
            className="h-fit w-[500px] p-[20px]"
            onClose={onClose}
            header={
                <>
                    <h3 className="font-bold text-[22px]">Want others to see your wishlist?</h3>
                    <p className="text-[#7e859b] text-[13px]">Your list privacy status is set to "{wishlist?.is_private ? 'Private' : 'Public'}"</p>
                    <Separator className="my-3" />
                </>
            }
            content={
                <div className="my-4">
                    <div className="rounded border border-gray-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-[16px]">{wishlist?.name}</p>
                                <p className="text-xs text-[#7e859b]">{(wishlist?.item_count || 0)} items</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {wishlist?.is_default && (
                                    <span className="rounded-[14px] bg-[#3866df] px-[10px] py-[2px] font-bold text-[12px] text-white">Default</span>
                                )}
                                <span className="inline-block">{wishlist?.is_private ? wishlist_icons.wishlistPrivateIcon : wishlist_icons.wishlistPublicIcon}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleCopy}
                        className="mt-5 flex w-full cursor-pointer items-center gap-3 rounded border bg-[#fafbfc] px-4 py-4 text-[#535871] hover:bg-[#f1f1f2]">
                        <span className="inline-block h-8 w-8 shrink-0 rounded-full border bg-white" />
                        <span className="font-medium">Copy link</span>
                    </button>
                </div>
            }
            footer={
                <Button className="mt-2 w-full" onClick={onClose}>
                    DONE
                </Button>
            }
        />
    ) : null
}


