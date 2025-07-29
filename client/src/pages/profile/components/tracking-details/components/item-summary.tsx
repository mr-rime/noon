import { Link } from '@tanstack/react-router'
import { tarcking_icons } from '../constants/icons'
import { Image } from '@unpic/react'

export function ItemSummary() {
  return (
    <section className="mt-5 h-fit w-full bg-white p-[16px] transition-all">
      <h2 className="font-bold text-[19px]">Item summary</h2>

      <div className="mt-5 flex items-start space-x-4">
        <Link to="/$title/$productId" params={{ productId: '1', title: '' }}>
          <div className="max-w-[150px]">
            <Image
              src="/media/imgs/product-img1.avif"
              alt="product-img1"
              className="w-full"
              width={150}
              height={150}
              layout="constrained"
            />
          </div>
        </Link>
        <div>
          <p className="text-[14px]">
            QSHOP® Professional Video Photography Studio Kit for Smartphone and Camera with Microphone, LED Light,
            Starter Kit Compatible with YouTube TikTok for Content Creators
          </p>
          <span className="mt-2 flex items-center space-x-1 text-[#7e859b] text-[14px]">
            {tarcking_icons.returnableIcon}
            This item is returnable
          </span>

          <div className="mt-5 space-x-1 font-bold text-[16px]">
            <span>EGP</span>
            <span>399.00</span>
          </div>
        </div>
      </div>
    </section>
  )
}
