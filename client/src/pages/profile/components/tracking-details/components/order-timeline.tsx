import { ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { tarcking_icons } from '../constants/icons'
import { TimelineStatus } from './timeline-status'
import { Separator } from '@/components/ui/separator'

interface OrderTimelineProps {
  order: any
  tracking: any
}

export function OrderTimeline({ order, tracking }: OrderTimelineProps) {
  const [isCollapsible, setIsCollapsible] = useState(true)

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    })
  }

  const formatFullDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })
  }


  const timeline = [
    {
      status: 'placed',
      name: 'Placed',
      icon: tarcking_icons.placeIcon,
      completed: true,
      date: order?.created_at,
      description: 'Your order has been placed successfully'
    },
    {
      status: 'processing',
      name: 'Processing',
      icon: tarcking_icons.processingIcon,
      completed: ['processing', 'confirmed', 'dispatched', 'delivered'].includes(order?.status),
      date: order?.status === 'processing' ? order?.updated_at : null,
      description: 'Your order is being prepared'
    },
    {
      status: 'confirmed',
      name: 'Confirmed',
      icon: tarcking_icons.confirmedIcon,
      completed: ['confirmed', 'dispatched', 'delivered'].includes(order?.status),
      date: order?.status === 'confirmed' ? order?.updated_at : null,
      description: 'Your order is going through its packaging process. We will email you when it is packed and dispatched to the final hub',
      isCurrent: order?.status === 'confirmed'
    },
    {
      status: 'dispatched',
      name: 'Dispatched',
      icon: tarcking_icons.dispatchedIcon,
      completed: ['dispatched', 'delivered'].includes(order?.status),
      date: order?.status === 'dispatched' ? order?.updated_at : null,
      description: 'Your order has been dispatched and is on its way'
    },
    {
      status: 'delivered',
      name: 'Delivery',
      icon: tarcking_icons.deliverdIcon,
      completed: order?.status === 'delivered',
      date: order?.status === 'delivered' ? order?.updated_at : null,
      deliveryByDate: tracking?.estimated_delivery_date ? formatFullDate(tracking.estimated_delivery_date) : null,
      isLast: true,
      description: 'Your order has been delivered'
    }
  ]

  return (
    <div>
      <section className="mt-5 h-fit w-full bg-white p-[16px_16px_0px] transition-all">
        {timeline.map((item, index) => {
          if (index === 1 || index === 3) {
            return (
              <div key={item.status} className={`overflow-hidden transition-all duration-200 ${isCollapsible ? 'max-h-[500px]' : 'max-h-0'}`}>
                <TimelineStatus
                  isCompleted={item.completed}
                  icon={item.icon}
                  statusName={item.name}
                  statusDate={item.date ? formatDate(item.date) : ''}
                  statusDesc={item.description}
                  isCurrent={item.isCurrent}
                  deliveryByDate={item.deliveryByDate}
                  isLast={item.isLast}
                />
              </div>
            )
          }

          return (
            <TimelineStatus
              key={item.status}
              isCompleted={item.completed}
              icon={item.icon}
              statusName={item.name}
              statusDate={item.date ? formatDate(item.date) : ''}
              statusDesc={item.description}
              isCurrent={item.isCurrent}
              deliveryByDate={item.deliveryByDate}
              isLast={item.isLast}
            />
          )
        })}

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
