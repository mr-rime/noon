import React, { useState, useRef, useEffect, memo } from 'react'
import { cn } from '@/utils/cn'
import { animateElement } from '@/utils/animateElement'

export const DropdownItem = memo(function DropdownItem({
  children,
  className,
  disabled = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { disabled?: boolean }) {
  return (
    <div
      className={cn(
        'cursor-pointer select-none px-4 py-2 text-gray-800 text-sm transition-colors',
        'hover:bg-gray-100 active:bg-gray-200',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}>
      {children}
    </div>
  )
})

interface DropdownProps {
  trigger: React.ReactNode | ((isOpen: boolean) => React.ReactNode)
  children: React.ReactNode
  className?: string
  dropdownClassName?: string
  position?: 'bottom' | 'top'
  align?: 'left' | 'center' | 'right'
  /** Optional CSS selector for a container element to anchor to (for mobile menus) */
  containerSelector?: string
  closeOnSelect?: boolean
  animationDuration?: number
}

export const Dropdown = memo(function Dropdown({
  trigger,
  children,
  className,
  dropdownClassName,
  position = 'bottom',
  align = 'center',
  // ensure containerSelector is defined when referenced
  containerSelector,
  closeOnSelect = true,
  animationDuration = 150,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [coordsRight, setCoordsRight] = useState<number | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const scrollX = window.scrollX || window.pageXOffset
    const scrollY = window.scrollY || window.pageYOffset

    // If a containerSelector is provided, anchor relative to that container
    if (containerSelector) {
      const container = document.querySelector(containerSelector) as HTMLElement | null
      if (container) {
        const crect = container.getBoundingClientRect()
        const top = position === 'top' ? crect.top + scrollY : crect.bottom + scrollY

        // Position right edge to container's right by calculating right offset from viewport
        setCoords({ top, left: crect.right + scrollX })
        setCoordsRight(window.innerWidth - (crect.right + scrollX))
        return
      }
    }

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      const top = position === 'top' ? rect.top + scrollY : rect.bottom + scrollY
      let left = rect.left + scrollX

      if (align === 'center') left = rect.left + rect.width / 2 + scrollX
      if (align === 'right') left = rect.right + scrollX

      setCoords({ top, left })
      setCoordsRight(null)
    }
  }, [isOpen, position, align, containerSelector])

  useEffect(() => {
    if (!isOpen) return
    const handle = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedInsideDropdown = contentRef.current?.contains(target)
      const clickedTrigger = triggerRef.current?.contains(target)

      if (!clickedInsideDropdown && !clickedTrigger) {
        setTimeout(() => setIsOpen(false), 0)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [isOpen])

  useEffect(() => {
    if (!contentRef.current) return
    const el = contentRef.current
    el.style.display = 'block'

    animateElement(
      el,
      isOpen
        ? [
          { opacity: 0, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1)' },
        ]
        : [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.95)' },
        ],
      { duration: animationDuration, fill: 'forwards', easing: 'cubic-bezier(0.4,0,0.2,1)' },
    ).onfinish = () => {
      if (!isOpen) el.style.display = 'none'
    }
  }, [isOpen, animationDuration])

  return (
    <>
      <div ref={triggerRef} className={cn('inline-block', className)} onClick={() => setIsOpen((o) => !o)}>
        {typeof trigger === 'function' ? trigger(isOpen) : trigger}
      </div>

      <div
        ref={contentRef}
        className={cn(
          ' top-0 z-[9999] rounded-md border border-gray-200 bg-white py-1 shadow-lg',
          align === 'center' && '-translate-x-1/2',
          align === 'right' && '-translate-x-full',
          dropdownClassName,
        )}
        style={{
          position: 'absolute',
          top: coords.top,
          left: coordsRight !== null ? undefined : coords.left,
          right: coordsRight !== null ? coordsRight : undefined,
          visibility: !isOpen ? 'hidden' : 'visible',
          pointerEvents: isOpen ? 'auto' : 'none',
          minWidth: 120,
        }}>
        {closeOnSelect
          ? React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child
            return (
              <div
                onClick={(e) => {
                  if (typeof (child.props as any).onClick === 'function') {
                    ; (child.props as any).onClick(e)
                  }
                  if (!e.defaultPrevented) {
                    setIsOpen(false)
                  }
                }}>
                {child}
              </div>
            )
          })
          : children}
      </div>
    </>
  )
})
