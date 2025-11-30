import type React from 'react'
import { cn } from '../../utils/cn'
import { Check } from 'lucide-react'
import type { CheckboxProps } from '@/shared/types/ui'

export function Checkbox({
  label,
  name,
  checked,
  onChange,
  onCheckedChange,
  description,
  className,
  disabled = false,
  id
}: CheckboxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event)
    }
    if (onCheckedChange) {
      onCheckedChange(event.target.checked)
    }
  }

  const checkboxId = id || `checkbox-${name || Math.random().toString(36).substr(2, 9)}`

  return (
    <label
      htmlFor={checkboxId}
      className={cn('flex items-center gap-3', className, {
        'cursor-pointer': !disabled,
        'cursor-not-allowed opacity-50': disabled,
      })}>
      <div className="relative h-5 w-5">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={handleChange}
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
          {checked && <Check color="white" size={12} />}
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="font-medium text-gray-900 text-sm">{label}</span>}
          {description && <span className="text-gray-500 text-xs">{description}</span>}
        </div>
      )}
    </label>
  )
}
