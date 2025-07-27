import { useNavigate } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { ChevronRight } from 'lucide-react'
import { useRef } from 'react'

export function Order() {
  const navigate = useNavigate()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = () => {
    if (buttonRef.current) {
      navigate({
        to: '/orders/track/order/$orderId',
        params: { orderId: '1' },
      })
      const ripple = document.createElement('span')
      ripple.className = 'absolute bg-[#F6F8FD] rounded-full animate-ripple'

      const rect = buttonRef.current.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)

      const x = rect.width / 2 - size / 2
      const y = rect.height / 2 - size / 2

      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.width = `${size}px`
      ripple.style.height = `${size}px`

      buttonRef.current.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    }
  }

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-[8px] border border-[#dadce3] bg-white px-8 py-10 transition-colors hover:border-[#9ba0b1]">
      <div className="z-[2]">
        <div className="flex items-center space-x-1">
          <span className="font-bold text-[#38ae04] text-[16px]">Delivered</span>
          <div>
            <span>on Saturday, 10th May, 02:15 PM</span>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <Image
            src="/media/imgs/product-img1.avif"
            alt="product-img"
            className="h-[89px] w-[64px]"
            width={64}
            height={89}
            layout="constrained"
          />
          <p className="line-clamp-3 max-w-[270px] text-left text-[12px]">
            COUGAR Roller Skate Shoe Cougar Model 509 For Adult Adjustable Roller Skates with 4 Illuminating Pu Wheels,
            Outdoors and Indoors Roller Blades for Boys Girls Beginners Color : Black Size : 42
          </p>
        </div>
      </div>

      <div className="z-[2] flex min-h-[115px] flex-col items-center justify-between">
        <div />
        <ChevronRight size={23} />
        <div className="text-[#9ba0b1] text-[12px] ">
          <span>Order ID</span> <strong>NEGH50034507263</strong>
        </div>
      </div>
    </button>
  )
}
