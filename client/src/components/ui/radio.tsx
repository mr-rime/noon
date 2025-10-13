import { cn } from '../../utils/cn'
import type { RadioProps } from '@/types/ui'

export function Radio({ label, name, value, checked, onChange, description, className, disabled = false }: RadioProps) {
  return (
    <label
      className={cn('flex items-center gap-3', className, {
        'cursor-pointer': !disabled,
        'cursor-not-allowed opacity-50': disabled,
      })}>
      <div className="relative h-5 w-5">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={cn(
            'h-full w-full rounded-full border-1 transition-all duration-200',
            checked ? 'border-blue-600 bg-blue-600' : 'border-[#DCDEE5] bg-white',
            'flex items-center justify-center',
            {
              'peer-focus:ring-2 peer-focus:ring-blue-200': !disabled,
            },
          )}>
          <div
            className={cn(
              'h-1.5 w-1.5 rounded-full bg-white transition-opacity duration-200',
              checked ? 'opacity-100' : 'opacity-0',
            )}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 text-sm">{label}</span>
        {description && <span className="text-gray-500 text-xs">{description}</span>}
      </div>
    </label>
  )
}
