import { ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { tarcking_icons } from '../constants/icons'
import { PlacedIconSroke, ProcessingStroke, ConfirmedIconStroke, DispatchedIconStroke, DeliveredIconStroke } from '../constants/components'
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



  const shouldShowFilledIcon = (status: string) => {
    const statusOrder = ['placed', 'processing', 'confirmed', 'dispatched', 'delivered']
    const currentStatusIndex = statusOrder.indexOf(order?.status)
    const statusIndex = statusOrder.indexOf(status)


    return statusIndex <= currentStatusIndex
  }

  const timeline = [
    {
      status: 'placed',
      name: 'Placed',
      icon: shouldShowFilledIcon('placed') ? tarcking_icons.placeIcon : <PlacedIconSroke />,
      completed: true,
      date: order?.created_at,
      description: 'Your order has been placed successfully',
      isCurrent: order?.status === 'placed'
    },
    {
      status: 'processing',
      name: 'Processing',
      icon: shouldShowFilledIcon('processing') ? tarcking_icons.processingIcon : <ProcessingStroke />,
      completed: ['processing', 'confirmed', 'dispatched', 'delivered'].includes(order?.status),
      date: order?.status === 'processing' ? order?.updated_at : null,
      description: 'Your order is being prepared and verified',
      isCurrent: order?.status === 'processing'
    },
    {
      status: 'confirmed',
      name: 'Confirmed',
      icon: shouldShowFilledIcon('confirmed') ? tarcking_icons.confirmedIcon : <ConfirmedIconStroke />,
      completed: ['confirmed', 'dispatched', 'delivered'].includes(order?.status),
      date: order?.status === 'confirmed' ? order?.updated_at : null,
      description: 'Your order is going through its packaging process. We will email you when it is packed and dispatched to the final hub',
      isCurrent: order?.status === 'confirmed'
    },
    {
      status: 'dispatched',
      name: 'Dispatched',
      icon: shouldShowFilledIcon('dispatched') ? tarcking_icons.dispatchedIcon : <DispatchedIconStroke />,
      completed: ['dispatched', 'delivered'].includes(order?.status),
      date: order?.status === 'dispatched' ? order?.updated_at : null,
      description: 'Your order has been dispatched and is on its way to you',
      isCurrent: order?.status === 'dispatched'
    },
    {
      status: 'delivered',
      name: 'Delivered',
      icon: shouldShowFilledIcon('delivered') ? tarcking_icons.deliverdIcon : <DeliveredIconStroke />,
      completed: order?.status === 'delivered',
      date: order?.status === 'delivered' ? order?.updated_at : null,
      deliveryByDate: tracking?.estimated_delivery_date ? formatFullDate(tracking.estimated_delivery_date) : null,
      isLast: true,
      description: 'Your order has been successfully delivered',
      isCurrent: order?.status === 'delivered'
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
                  showMessage={item.status !== 'delivered'}
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
              showMessage={item.status !== 'delivered'}
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
