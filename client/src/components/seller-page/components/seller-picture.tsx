import { Image } from '@unpic/react'

export function SellerPicture() {
  return (
    <div className="- 72px)] -translate-y-1/2 absolute top-0 flex h-[110px] w-[calcl(100% items-center justify-center">
      <div className="flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-full border-[#f3f4f8] border-[5px] bg-white">
        <Image
          src="/media/imgs/noon-logo.png"
          alt="logo"
          className="h-full w-full"
          width={110}
          height={110}
          layout="constrained"
        />
      </div>
    </div>
  )
}
