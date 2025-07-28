import type React from 'react'
import { cn } from '../../utils/cn'
import { Check } from 'lucide-react'

type CheckboxProps = {
  label: string
  name: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  className?: string
  disabled?: boolean
}

export function Checkbox({ label, name, checked, onChange, description, className, disabled = false }: CheckboxProps) {
  return (
    <label
      className={cn('flex items-center gap-3', className, {
        'cursor-pointer': !disabled,
        'cursor-not-allowed opacity-50': disabled,
      })}>
      <div className="relative h-5 w-5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />
        <div
          className={cn(
            'h-full w-full rounded border transition-all duration-200',
            checked ? 'border-blue-600 bg-blue-600' : 'border-[#DCDEE5] bg-white',
            'flex items-center justify-center',
            {
              'peer-focus:ring-2 peer-focus:ring-blue-200': !disabled,
            },
          )}>
          <Check color="white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 text-sm">{label}</span>
        {description && <span className="text-gray-500 text-xs">{description}</span>}
      </div>
    </label>
  )
}
