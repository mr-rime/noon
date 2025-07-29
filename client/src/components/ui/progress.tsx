import { cn } from '../../utils/cn'

type ProgressColorType = '#38AE04' | '#82ae04' | '#F3AC30' | '#F36C32'

type ProgressProps = {
  progressPercentage: string | number
  progressColor?: ProgressColorType
  className?: string
}

export function Progress({ progressPercentage, progressColor = '#38AE04', className }: ProgressProps) {
  return (
    <div className={cn('relative h-[8px] w-full min-w-[60px] overflow-hidden rounded-[50px] bg-[#f3f4f8]', className)}>
      <div
        className="absolute h-full rounded-[50px]"
        style={{
          width: progressPercentage ?? '100%',
          backgroundColor: progressColor,
        }}></div>
    </div>
  )
}
