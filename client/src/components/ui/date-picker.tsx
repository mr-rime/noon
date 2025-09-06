import { animateElement } from '@/utils/animateElement'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
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
    if (!val) return null
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
  const [selectedDate, setSelectedDate] = useState<Date>(initial)
  const [viewDate, setViewDate] = useState<Date>(initial)

  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        closeWithAnimation()
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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

    const prevMonthDays = new Date(year, month, 0).getDate()

    const days = []

    // Days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="flex h-9 w-9 items-center justify-center text-gray-400 text-sm">
          {prevMonthDays - i}
        </div>,
      )
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === i
      const isSelected =
        selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === i

      days.push(
        <button
          key={i}
          onClick={() => handleDateClick(i)}
          className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-sm transition-all ${isSelected ? 'bg-black text-white' : isToday ? 'border border-blue-500 text-blue-600' : 'hover:bg-gray-100'} ${isToday && !isSelected ? 'ring-2 ring-blue-400' : ''}`}>
          {i}
        </button>,
      )
    }

    return days
  }

  return (
    <div className="relative inline-block w-full text-left">
      {labelContent && <label className="mb-1 block font-medium text-gray-700 text-sm">{labelContent}</label>}
      <button
        ref={buttonRef}
        onClick={toggleOpen}
        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-sm shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
        {selectedDate ? selectedDate.toDateString() : 'Select a date'}
      </button>

      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute top-14 z-20 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between font-semibold text-gray-700 text-sm">
            <button onClick={() => changeYear(-1)} className="flex cursor-pointer rounded p-1 hover:bg-gray-100">
              <ChevronsLeft size={16} />
            </button>
            <button onClick={() => changeMonth(-1)} className="cursor-pointer rounded p-1 hover:bg-gray-100">
              <ChevronLeft size={16} />
            </button>
            <span className="px-2">
              {months[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <button onClick={() => changeMonth(1)} className="cursor-pointer rounded p-1 hover:bg-gray-100">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => changeYear(1)} className="cursor-pointer rounded p-1 hover:bg-gray-100">
              <ChevronsRight size={16} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 font-medium text-gray-500 text-xs">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
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
