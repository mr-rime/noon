import { useState } from 'react'
import { BouncingLoading } from '@/components/ui/bouncing-loading'
import { ModalDialog } from '@/components/ui/modal-dialog/modal-dialog'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { wishlist_icons } from '../constants'
import { useApolloClient, useMutation } from '@apollo/client'
import { CREATE_WISHLIST, ADD_WISHLIST_ITEM, REMOVE_WISHLIST_ITEM, GET_WISHLISTS, GET_WISHLIST_ITEMS } from '@/graphql/wishlist'

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
                                <span className="text-xs text-[#7e859b]">{w.item_count > 0 ? `${w.item_count} items` : 'No items'}</span>
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
