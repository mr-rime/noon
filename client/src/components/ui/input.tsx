import { cn } from '../../utils/cn'
import type { InputProps } from '@/types/ui'
export function Input({
  className,
  input,
  button = false,
  icon,
  iconDirection = 'left',
  buttonDirection = 'right',
  labelContent,
  onButtonClick,
  ...rest
}: InputProps) {
  const hasIcon = !!icon
  const iconLeft = hasIcon && iconDirection === 'left'
  const iconRight = hasIcon && iconDirection === 'right'
  const isButton = !!button
  const buttonContent = typeof button === 'object' && button.content ? button.content : 'apply'

  return (
    <div className={cn('flex', labelContent ? 'flex-col items-start gap-2' : 'items-center', className)}>
      {labelContent && (
        <label htmlFor={rest.id} className="text-[16px]">
          {labelContent}
        </label>
      )}
      <div className={cn('flex w-full items-center', buttonDirection === 'right' ? 'flex-row-reverse' : 'flex-row')}>
        {isButton && (
          <button
            type="button"
            onClick={onButtonClick}
            className={cn(
              'h-[40px] min-w-[64px] cursor-pointer bg-[#3866df] px-[12px] font-bold text-[14px] text-white uppercase',
              buttonDirection === 'right' ? 'rounded-r-[6px]' : 'rounded-l-[6px]',
            )}>
            {buttonContent}
          </button>
        )}
        <div className="relative w-full">
          <div className={cn('absolute inset-y-0 flex items-center', iconLeft && 'left-3', iconRight && 'right-3')}>
            {icon}
          </div>
          <input
            className={cn(
              'w-full border border-[#E2E5F1] px-3 text-[16px] outline-none',
              'rounded-[6px] pt-[10px] pb-[10px] leading-[1.2]',
              iconLeft && 'pl-10',
              iconRight && 'pr-10',
              input?.className,
              isButton && buttonDirection === 'left' && 'rounded-l-none',
              isButton && buttonDirection === 'right' && 'rounded-r-none',
            )}
            {...rest}
          />
        </div>
      </div>
    </div>
  )
}
