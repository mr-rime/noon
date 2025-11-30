import { Image } from '@unpic/react'

export function ProductBadge() {
  return (
    <div className="mt-2 h-[18px] select-none" aria-label="badge" role="img">
      <Image
        src="/media/svgs/marketplace-v2-en.svg"
        alt="badge"
        className="h-full w-auto"
        draggable={false}
        width={46}
        height={18}
        layout="constrained"
      />
    </div>
  )
}
