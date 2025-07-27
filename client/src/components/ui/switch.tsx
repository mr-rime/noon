import type React from 'react'
import { cn } from '../../utils/cn'

type SwitchProps = {
  label?: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  description?: string
  className?: string
  disabled?: boolean
  name?: string
}

export function Switch({ label, checked, onChange, description, className, disabled = false, name }: SwitchProps) {
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="flex h-6 items-center">
        <label
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200',
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          )}>
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="peer sr-only"
          />
          <span
            className={cn(
              'absolute inset-0 rounded-full transition-colors',
              checked ? 'bg-blue-600' : 'bg-gray-300',
              !disabled && 'peer-focus:ring-2 peer-focus:ring-blue-300',
            )}
          />
          <span
            className={cn(
              'absolute top-[2px] left-[2px] h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200',
              checked ? 'translate-x-[20px]' : 'translate-x-0',
            )}
          />
        </label>
      </div>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 text-sm">{label}</span>
        {description && <span className="text-gray-500 text-xs">{description}</span>}
      </div>
    </div>
  )
}
