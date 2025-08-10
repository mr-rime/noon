import { ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { tarcking_icons } from '../constants/icons'
import { TimelineStatus } from './timeline-status'
import { Separator } from '@/components/ui/separator'

export function OrderTimeline() {
  const [isCollapsible, setIsCollapsible] = useState(true)

  return (
    <div>
      <section className="mt-5 h-fit w-full bg-white p-[16px_16px_0px] transition-all">
        <TimelineStatus isCompleted={true} icon={tarcking_icons.placeIcon} statusName="Placed" statusDate="12th Jun" />
        <div className={`overflow-hidden transition-all duration-200 ${isCollapsible ? 'max-h-[500px]' : 'max-h-0'}`}>
          <TimelineStatus
            isCompleted={true}
            icon={tarcking_icons.processingIcon}
            statusName="Processing"
            statusDate="12th Jun"
          />
        </div>
        <TimelineStatus
          isCompleted={true}
          icon={tarcking_icons.confirmedIcon}
          statusName="Confirmed"
          statusDate="12th Jun"
          isCurrent
          statusDesc="Your order is going through its packaging process. We will email you when it is packed and dispatched to the final hub"
        />

        <div className={`overflow-hidden transition-all duration-200 ${isCollapsible ? 'max-h-[500px]' : 'max-h-0'}`}>
          <TimelineStatus icon={tarcking_icons.dispatchedIcon} statusName="Dispatched" statusDate="12th Jun" />
        </div>

        <TimelineStatus
          icon={tarcking_icons.deliverdIcon}
          statusName="Delivery"
          deliveryByDate="Sunday, 15th Jun"
          isLast
          statusDate="12th Jun"
        />

        <Separator className="mt-3" />

        <button
          onClick={() => setIsCollapsible((prev) => !prev)}
          className="flex w-full cursor-pointer items-center justify-center py-[10px] text-[#7e859b] text-[14px] hover:underline">
          {isCollapsible ? 'Hide full tracking' : 'Show full tracking'}
          <ChevronUp
            size={20}
            className={`mx-2 transition-transform duration-300 ${isCollapsible ? 'rotate-180' : ''}`}
          />
        </button>
      </section>
    </div>
  )
}
