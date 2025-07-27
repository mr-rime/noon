import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { animateElement } from '../../utils/animateElement'
import { cn } from '../../utils/cn'

interface SelectOption {
  value: string
  label: string
}

type SelectProps = {
  options: SelectOption[]
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
  children?: React.ReactNode
  labelContent?: string
}

export function Select({ options, defaultValue, onChange, className, labelContent }: SelectProps) {
  const isValidDefault = defaultValue && options.some((opt) => opt.value === defaultValue)
  const initial = isValidDefault ? defaultValue : options[0]?.value

  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | undefined>(initial)

  const selectRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === selectedValue)

  const toggleDropdown = () => setIsOpen((prev) => !prev)

  const handleSelect = (value: string) => {
    if (value === selectedValue) {
      setIsOpen(false)
      return
    }

    setSelectedValue(value)
    onChange?.(value)
    setIsOpen(false)
  }

  useEffect(() => {
    if (!optionsRef.current) return

    if (isOpen) {
      optionsRef.current.style.display = 'block'
      animateElement(
        optionsRef.current,
        [
          { opacity: 0, transform: 'translateY(-10px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 200 },
      )
    } else {
      const animation = animateElement(
        optionsRef.current,
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-10px)' },
        ],
        { duration: 200 },
      )

      animation.onfinish = () => {
        if (optionsRef.current) {
          optionsRef.current.style.display = 'none'
        }
      }
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (defaultValue && options.some((opt) => opt.value === defaultValue)) {
      setSelectedValue(defaultValue)
    }
  }, [defaultValue, options])

  return (
    <div className="relative flex flex-col items-start justify-center gap-2 " ref={selectRef}>
      {labelContent && <label className="text-[16px] ">{labelContent}</label>}
      <div
        className={cn(
          'flex w-full cursor-pointer items-center justify-between rounded-[8px] border border-[#e2e5f1] bg-white p-[8px] px-3 pt-[10px] pb-[10px] capitalize',
          className,
        )}
        onClick={toggleDropdown}>
        <span className="mr-[3px]">{selectedOption?.label || 'Select an option'}</span>
        <ChevronDown size={17} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <div
        ref={optionsRef}
        className="absolute top-full right-0 left-0 z-10 mt-1 overflow-hidden rounded-[8px] border border-[#e2e5f1] bg-white opacity-0 shadow-lg "
        style={{ display: isOpen ? 'block' : 'none' }}>
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              'cursor-pointer p-[8px] hover:bg-gray-100',
              selectedValue === option.value && 'bg-blue-50 text-blue-600',
            )}
            onClick={() => handleSelect(option.value)}>
            {option.label}
          </div>
        ))}
      </div>
    </div>
  )
}
