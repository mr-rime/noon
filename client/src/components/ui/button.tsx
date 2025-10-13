import { cn } from '../../utils/cn'
import type { ButtonProps } from '@/types/ui'

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        'h-[48px] cursor-pointer rounded-[4px] bg-[#3866df] px-[32px] font-bold text-[14px] text-white uppercase transition-colors duration-300 hover:bg-[#3E72F7]',
        className,
      )}>
      {children}
    </button>
  )
}
