import { cn } from "@/utils/cn"

type StatusNameType = 'Placed' | 'Processing' | 'Confirmed' | 'Dispatched' | 'Delivery' | string

type TimelineStatusProps = {
  icon: React.ReactNode | React.ReactElement
  statusName: StatusNameType
  statusDate: string
  deliveryByDate?: string | null
  isCurrent?: boolean
  statusDesc?: string
  isLast?: boolean
  isCompleted?: boolean
}

export function TimelineStatus({
  icon,
  statusName,
  statusDate,
  deliveryByDate,
  isCurrent = false,
  statusDesc,
  isLast = false,
  isCompleted = false,
}: TimelineStatusProps) {
  return (
    <div className={cn('relative grid grid-cols-[auto_1fr] gap-[12px]', isCurrent ? 'h-auto' : 'h-[48px]')}>
      <div
        className={cn(
          'relative z-[2] flex aspect-square w-[33px] items-center justify-center rounded-full',
          !isCurrent && 'border-[4px] border-white',
          isCompleted ? 'bg-[#38ae04]' : 'bg-white',
        )}>
        <div className={cn(isCurrent && 'scale-[1.3]')}>{icon}</div>
      </div>
      <div className="flex flex-col">
        <div className="space-x-2">
          <span className={cn(isCurrent ? 'font-bold text-[#38ae04] text-[19px]' : 'text-[16px]')}>
            {statusName} {deliveryByDate && `by ${deliveryByDate}`}
          </span>
          <span className="text-[#7e859b] text-[12px]">on {statusDate}</span>
        </div>
        {isCurrent && (
          <div className="mb-5">
            <span className="font-[500] text-[19px]">on time</span>
            <p className="w-full text-[14px]">{statusDesc}</p>
          </div>
        )}
      </div>
      {!isLast && (
        <div
          className={cn(
            'absolute top-0 left-[15px] z-[1] h-full w-[2px] transition-all',
            isCurrent && 'h-0 animate-timeline',
            isCompleted ? 'bg-[#38ae04]' : 'bg-[#dadce3]',
          )}
        />
      )}
      {isCurrent && <div className="absolute top-0 left-[15px] h-full w-[2px] bg-[#dadce3]" />}
    </div>
  )
}
