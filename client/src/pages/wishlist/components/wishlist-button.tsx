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

  const isActive = id === wishlistCode

  const handleNavigate = () => {
    navigate({ search: { wishlistCode: id } })
  }

  const handlePrefetch = async () => {
    if (!hasFetched) {
      await refetch({ fetchPolicy: 'network-only' })
      setHasFetched(true)
    }
  }

  return (
    <button
      onClick={handleNavigate}
      onMouseEnter={handlePrefetch}
      aria-pressed={isActive}
      className={cn(
        'group relative flex w-full min-w-[220px] cursor-pointer flex-col rounded-2xl border border-[#EAECF0] px-4 py-3 text-left shadow-sm transition-all duration-200 hover:border-[#cfd7f6] hover:shadow-md lg:min-w-0',
        isActive && 'border-[#3866df] bg-[#f4f7ff] shadow-md',
      )}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-semibold text-sm text-[#1f2024]">{name}</p>
          <p className="text-xs text-[#7e859b]">{item_count} item{item_count === 1 ? '' : 's'}</p>
        </div>
        {is_default && (
          <span className="rounded-full bg-[#3866df] px-3 py-1 text-[11px] font-semibold uppercase text-white">
            Default
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-[#7e859b]">
        {is_private ? wishlist_icons.wishlistPrivateIcon : wishlist_icons.wishlistPublicIcon}
        <span>{is_private ? 'Private list' : 'Shared list'}</span>
      </div>
    </button>
  )
}
