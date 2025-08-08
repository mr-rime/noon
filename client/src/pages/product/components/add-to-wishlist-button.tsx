import { Heart } from 'lucide-react'

export function AddToWishlistButton() {
  return (
    <button className="flex h-[32px] w-[32px] items-center justify-center rounded-[6px] bg-[#f3f4f8] p-1">
      <Heart size={19} className="fill-[#3866DF] text-[#3866DF]" />
    </button>
  )
}
