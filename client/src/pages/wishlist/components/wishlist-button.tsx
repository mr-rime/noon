import { cn } from '@/utils/cn'
import { wishlist_icons } from '../constants'
import type { WishlistType } from '../types'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery } from '@apollo/client'
import { GET_WISHLIST_ITEMS } from '@/graphql/wishlist'
import { useState } from 'react'

export function WishlistButton({ id, name, is_default, is_private, item_count }: WishlistType) {
  const [hasFetched, setHasFetched] = useState(false)
  const navigate = useNavigate({ from: '/wishlist' })
  const { refetch } = useQuery(GET_WISHLIST_ITEMS, { variables: { wishlist_id: id }, skip: true })
  const { wishlistCode } = useSearch({ from: '/(main)/_homeLayout/wishlist/' })

  const handleNavigate = () => {
    navigate({ search: { wishlistCode: id } })
  }

  const handlePrefetch = async () => {
    if (!hasFetched) {
      await refetch({ fetchPolicy: 'network-only' })
    }

    setHasFetched(true)
  }

  return (
    <button
      onClick={handleNavigate}
      onMouseEnter={handlePrefetch}
      className={cn(
        'w-full cursor-pointer p-[20px]',
        id === wishlistCode ? 'border border-[#ebecf0] bg-[#ebecf0]' : 'border border-[#ebecf0]',
      )}>
      <p className="flex items-center gap-1">
        <span className="px-[7px] text-start font-bold text-[16px]">{name}</span>
        {is_default && (
          <span className="rounded-[14px] bg-[#3866df] px-[10px] py-[2px] font-bold text-[12px] text-white">
            Defualt
          </span>
        )}
      </p>
      <p className="mt-3 flex items-center gap-2">
        <span className="text-[14px]">{item_count} items </span>
        {is_private ? (
          <span>{wishlist_icons.wishlistPrivateIcon}</span>
        ) : (
          <span>{wishlist_icons.wishlistPublicIcon}</span>
        )}
      </p>
    </button>
  )
}
