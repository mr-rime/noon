import { useState } from 'react'
import { BouncingLoading } from '@/shared/components/ui/bouncing-loading'
import { ModalDialog } from '@/shared/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/shared/components/ui/separator'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { wishlist_icons } from '../constants'
import { useApolloClient, useMutation } from '@apollo/client'
import { CREATE_WISHLIST, ADD_WISHLIST_ITEM, REMOVE_WISHLIST_ITEM, GET_WISHLISTS, GET_WISHLIST_ITEMS } from '@/features/wishlist/api/wishlist'
import { toast } from 'sonner'

export function MoveOrCopyWishlistItemModal({
    isOpen,
    wishlists,
    onDone,
    onClose,
    operation = 'move',
    productId,
    currentWishlistId
}: {
    isOpen: boolean
    wishlists: any[]
    productId: string | null
    currentWishlistId?: string
    onDone: () => void
    onClose: () => void
    operation: 'move' | 'copy'
}) {
    const [checked, setChecked] = useState<string[]>([])
    const [createNew, setCreateNew] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const apolloClient = useApolloClient()
    const [createWishlist] = useMutation(CREATE_WISHLIST, {
        refetchQueries: [GET_WISHLISTS],
        awaitRefetchQueries: true,
    })
    const [addWishlistItem] = useMutation(ADD_WISHLIST_ITEM, {
        refetchQueries: [GET_WISHLISTS],
        awaitRefetchQueries: true,
    })
    const [removeWishlistItem] = useMutation(REMOVE_WISHLIST_ITEM, {
        refetchQueries: [GET_WISHLISTS, { query: GET_WISHLIST_ITEMS, variables: { wishlist_id: currentWishlistId } }],
        awaitRefetchQueries: true,
    })

    const MAX_ITEMS_PER_WISHLIST = 5

    const checkWishlistCapacity = async (wishlistId: string): Promise<boolean> => {
        try {
            const { data } = await apolloClient.query({
                query: GET_WISHLIST_ITEMS,
                variables: { wishlist_id: wishlistId },
                fetchPolicy: 'network-only'
            })
            const currentItems = data?.getWishlistItems?.data || []
            return currentItems.length < MAX_ITEMS_PER_WISHLIST
        } catch (error) {
            console.error('Error checking wishlist capacity:', error)
            return false
        }
    }
    const handleDone = async () => {
        if (submitting) return
        setSubmitting(true)
        const targetIds = [...checked]
        if (createNew.trim()) {
            const { data } = await createWishlist({ variables: { name: createNew } })
            const newId = data?.createWishlist?.data?.id
            if (newId) targetIds.push(newId)
        }

        if (productId) {

            const capacityChecks = await Promise.all(
                targetIds.map(async (wishlist_id) => {
                    const hasCapacity = await checkWishlistCapacity(wishlist_id)
                    const wishlist = wishlists.find(w => w.id === wishlist_id)
                    return { wishlist_id, hasCapacity, wishlistName: wishlist?.name || 'Unknown' }
                })
            )

            const fullWishlists = capacityChecks.filter(({ hasCapacity }) => !hasCapacity)

            if (fullWishlists.length > 0) {
                const names = fullWishlists.map(({ wishlistName }) => wishlistName).join(', ')
                toast.error(`Cannot add to ${names}: Maximum ${MAX_ITEMS_PER_WISHLIST} items per wishlist`)
                setSubmitting(false)
                return
            }

            await Promise.all(targetIds.map((wishlist_id) => addWishlistItem({ variables: { product_id: productId, wishlist_id } })))
            await Promise.all(targetIds.map((wishlist_id) =>
                apolloClient.query({ query: GET_WISHLIST_ITEMS, variables: { wishlist_id }, fetchPolicy: 'network-only' })
            ))
            if (operation === 'move' && currentWishlistId) {
                await removeWishlistItem({ variables: { wishlist_id: currentWishlistId, product_id: productId } })
            }
        }
        setChecked([])
        setCreateNew('')
        setSubmitting(false)
        onDone()
    }
    return isOpen ? (
        <ModalDialog
            className="h-fit w-[500px] p-[20px]"
            onClose={onClose}
            header={
                <>
                    <h3 className="font-bold text-[22px]">{operation === 'move' ? 'Move to Wishlist(s)' : 'Copy to Wishlist(s)'}</h3>
                    <Separator className="my-3" />
                </>
            }
            content={
                <div className="my-4 max-h-[350px] overflow-y-auto">
                    {wishlists.map((w) => (
                        <div
                            key={w.id}
                            className="flex items-center justify-between border-b border-gray-100 px-2 py-3"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-[16px]">{w.name}</span>
                                <span className="text-xs text-[#374151]">{w.item_count > 0 ? `${w.item_count} items` : 'No items'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {w.is_private ? wishlist_icons.wishlistPrivateIcon : wishlist_icons.wishlistPublicIcon}
                                <Checkbox
                                    checked={checked.includes(w.id)}
                                    onChange={() => {
                                        setChecked(
                                            checked.includes(w.id)
                                                ? checked.filter((id) => id !== w.id)
                                                : [...checked, w.id],
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    ))}

                </div>
            }
            footer={
                <Button
                    className="mt-2 w-full"
                    onClick={handleDone}
                    disabled={submitting || (checked.length === 0 && !createNew.trim())}
                >
                    {submitting ? <BouncingLoading /> : 'DONE'}
                </Button>
            }
        />
    ) : null
}
