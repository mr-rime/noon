import { animateElement } from '@/utils/animateElement'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface DatePickerProps {
  value: Date | string | null
  onChange: (date: Date) => void
  labelContent?: string
}

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const toDate = (val: unknown): Date | null => {
  try {
    const d = new Date(val as any)
    return isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}

export function DatePicker({ value, onChange, labelContent }: DatePickerProps) {
  const today = new Date()
  const initial = toDate(value) || today

  const [isOpen, setIsOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(toDate(value))
  const [viewDate, setViewDate] = useState<Date>(initial)

  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const animationRef = useRef<Animation | null>(null)

  const closeWithAnimation = () => {
    if (pickerRef.current) {
      const animation = animateElement(
        pickerRef.current,
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.95)' },
        ],
        { duration: 200 },
      )
      animationRef.current = animation
      animation.onfinish = () => setIsOpen(false)
    } else {
      setIsOpen(false)
    }
  }

  const toggleOpen = () => {
    if (isOpen) {
      closeWithAnimation()
    } else {
      setIsOpen(true)
    }
  }

  useEffect(() => {
    if (isOpen && pickerRef.current) {
      animateElement(
        pickerRef.current,
        [
          { opacity: 0, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        {},
      )
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeWithAnimation()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate)
    newDate.setDate(day)
    setSelectedDate(newDate)
    setViewDate(newDate)
    onChange(newDate)
    closeWithAnimation()
  }

  const changeMonth = (offset: number) => {
    setViewDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + offset)
      return newDate
    })
  }

  const changeYear = (offset: number) => {
    setViewDate((prev) => {
      const newDate = new Date(prev)
      newDate.setFullYear(prev.getFullYear() + offset)
      return newDate
    })
  }

  const renderDays = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrevMonth = new Date(year, month, 0).getDate()

    const days = []

    // Previous month's overflow
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="flex h-8 w-8 items-center justify-center text-gray-400">
          {daysInPrevMonth - i}
        </div>,
      )
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i

      const isSelected =
        selectedDate &&
        selectedDate.getFullYear() === year &&
        selectedDate.getMonth() === month &&
        selectedDate.getDate() === i

      const isActive = isSelected || (!selectedDate && isToday)

      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(i)}
          className={`flex h-8 w-8 items-center justify-center rounded cursor-pointer${isActive ? 'bg-black text-white' : 'hover:bg-gray-200'}
						${isToday && !isSelected ? 'ring-2 ring-blue-500' : ''}`}>
          {i}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="relative flex flex-col text-left">
      {labelContent && <label className="mb-1 text-[16px]">{labelContent}</label>}
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="cursor-pointer rounded-[8px] border border-[#E2E5F1] bg-white px-4 py-2">
        {selectedDate ? selectedDate.toDateString() : 'Select a date'}
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute top-16 z-10 mt-2 w-72 rounded border border-[#E2E5F1] bg-white p-4 shadow">
          <div className="mb-2 flex items-center justify-between">
            <button onClick={() => changeYear(-1)} className="cursor-pointer px-2">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => changeMonth(-1)} className="cursor-pointer px-2">
              <ChevronLeft size={16} />
            </button>
            <span className="font-semibold">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={() => changeMonth(1)} className="cursor-pointer px-2">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => changeYear(1)} className="cursor-pointer px-2">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 text-gray-500 text-sm">
            {'Su Mo Tu We Th Fr Sa'.split(' ').map((d) => (
              <div key={d} className="flex h-8 w-8 items-center justify-center">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        </div>
      )}
    </div>
  )
}
