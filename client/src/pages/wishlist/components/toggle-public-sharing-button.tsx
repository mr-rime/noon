import { useMutation } from '@apollo/client'
import { Switch } from '@/components/ui/switch'
import { GET_WISHLISTS, UPDATE_WISHLIST } from '@/graphql/wishlist'
import type { WishlistResponse, WishlistType } from '../types'
import { toast } from 'sonner'

export function TogglePublicSharingButton({ currentWishlist }: { currentWishlist: WishlistType | undefined }) {
    const [updateWishlist, { loading }] = useMutation<WishlistResponse<'updateWishlist', WishlistType>>(UPDATE_WISHLIST, {
        refetchQueries: [GET_WISHLISTS],
        awaitRefetchQueries: true,
    })

    const isPublic = currentWishlist ? !currentWishlist.is_private : false

    const handleToggle = async (checked: boolean) => {
        if (!currentWishlist) return
        const { data } = await updateWishlist({
            variables: {
                wishlist_id: currentWishlist.id,
                name: currentWishlist.name,
                is_default: currentWishlist.is_default,
                is_private: !checked ? true : false,
            },
        })

        if (data?.updateWishlist.success) {
            toast.success(checked ? 'Sharing enabled (Public)' : 'Sharing disabled (Private)')
        } else {
            toast.error(data?.updateWishlist.message || 'Could not update sharing status')
        }
    }

    return (
        <div className="flex w-full items-center justify-between border-gray-200/80 border-b p-2">
            <Switch
                disabled={loading || !currentWishlist}
                checked={isPublic}
                onCheckedChange={handleToggle}
                label="Enable/Disable Public Sharing"
            />
        </div>
    )
}


