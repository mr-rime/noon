import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/cn'
import { animateElement } from '../../utils/animateElement'

// ==================== Dropdown Item Component ====================
interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  disabled?: boolean
}

const DropdownItem = memo(function DropdownItem({
  children,
  className,
  disabled = false,
  ...props
}: DropdownItemProps) {
  return (
    <div
      className={cn(
        'px-4 py-2 text-gray-800 text-sm transition-colors',
        'hover:bg-gray-100 active:bg-gray-200',
        'cursor-pointer select-none',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}>
      {children}
    </div>
  )
})

// ==================== Dropdown Content Component ====================
interface DropdownContentProps {
  children: React.ReactNode
  positionStyle: { top: number; left: number; width: number }
  isOpen: boolean
  closeOnSelect: boolean
  dropdownClassName?: string
  closeDropdown: () => void
  animationDuration?: number
  align?: 'left' | 'right' | 'center'
}

const DropdownContent = memo(function DropdownContent({
  children,
  positionStyle,
  isOpen,
  closeOnSelect,
  dropdownClassName,
  closeDropdown,
  animationDuration = 150,
  align = 'left',
}: DropdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<Animation | null>(null)

  const enhancedChildren = useCallback(
    () =>
      closeOnSelect
        ? React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              const element = child as React.ReactElement<any>
              return React.cloneElement(element, {
                onClick: (e: React.MouseEvent) => {
                  ;(element.props as any).onClick?.(e)
                  if (!e.defaultPrevented) {
                    closeDropdown()
                  }
                },
              })
            }
            return child
          })
        : children,
    [children, closeOnSelect, closeDropdown],
  )

  useEffect(() => {
    if (!contentRef.current) return

    if (animationRef.current) {
      animationRef.current.cancel()
    }

    const animationConfig = {
      duration: animationDuration,
      fill: 'forwards' as const,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }

    if (isOpen) {
      contentRef.current.style.display = 'block'
      contentRef.current.style.pointerEvents = 'auto'
      animationRef.current = animateElement(
        contentRef.current,
        [
          { opacity: 0, transform: 'scale(0.95)' },
          { opacity: 1, transform: 'scale(1)' },
        ],
        animationConfig,
      )
    } else {
      animationRef.current = animateElement(
        contentRef.current,
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.95)' },
        ],
        animationConfig,
      )

      animationRef.current.onfinish = () => {
        if (contentRef.current) {
          contentRef.current.style.display = 'none'
          contentRef.current.style.pointerEvents = 'none'
        }
      }
    }
  }, [isOpen, animationDuration])

  return (
    <div
      ref={contentRef}
      className={cn(
        'fixed z-[9999] rounded-md border border-gray-200 bg-white shadow-lg',
        'overflow-hidden py-1',
        align === 'center' ? '-translate-x-1/2 transform' : '',
        dropdownClassName,
      )}
      style={{
        opacity: 0,
        display: 'none',
        top: `${positionStyle.top}px`,
        left: `${positionStyle.left}px`,
        width: 'fit-content',
        minWidth: '120px',
        pointerEvents: 'none',
      }}>
      {enhancedChildren()}
    </div>
  )
})

// ==================== Main Dropdown Component ====================
interface DropdownProps {
  children: React.ReactNode
  trigger: React.ReactNode | ((isOpen: boolean) => React.ReactNode)
  className?: string
  dropdownClassName?: string
  position?: 'bottom' | 'top'
  align?: 'left' | 'right' | 'center'
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  closeOnSelect?: boolean
  animationDuration?: number
}

export const Dropdown = memo(function Dropdown({
  children,
  trigger,
  className,
  dropdownClassName,
  position = 'bottom',
  align = 'left',
  isOpen: controlledOpen,
  onOpenChange,
  closeOnSelect = true,
  animationDuration = 150,
}: DropdownProps) {
  const [isInternalOpen, setIsInternalOpen] = useState(false)
  const [positionStyle, setPositionStyle] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const portalRoot = useRef(document.createElement('div')).current
  const [isMounted, setIsMounted] = useState(false)

  const isOpen = controlledOpen !== undefined ? controlledOpen : isInternalOpen

  const updatePosition = useCallback(() => {
    if (!dropdownRef.current) return

    const triggerRect = dropdownRef.current.getBoundingClientRect()
    let top = 0
    let left = 0
    const width = triggerRect.width

    if (position === 'top') {
      top = triggerRect.top - 8 // Add some spacing
    } else {
      top = triggerRect.bottom + 8
    }

    switch (align) {
      case 'left':
        left = triggerRect.left
        break
      case 'right':
        left = triggerRect.right - width
        break
      case 'center':
        left = triggerRect.left + triggerRect.width / 2
        break
    }

    // Ensure dropdown stays within viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const dropdownWidth = width

    // Adjust horizontal position if near viewport edges
    if (left + dropdownWidth > viewportWidth - 8) {
      left = viewportWidth - dropdownWidth - 8
    } else if (left < 8) {
      left = 8
    }

    setPositionStyle({ top, left, width })
  }, [position, align])

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true)
      updatePosition()
    }
  }, [isOpen, updatePosition])

  useEffect(() => {
    portalRoot.style.position = 'fixed'
    portalRoot.style.top = '0'
    portalRoot.style.left = '0'
    portalRoot.style.width = '100%'
    portalRoot.style.height = '0'
    portalRoot.style.zIndex = '9999'
    portalRoot.style.pointerEvents = 'none'

    document.body.appendChild(portalRoot)
    return () => {
      document.body.removeChild(portalRoot)
    }
  }, [portalRoot])

  const toggleDropdown = useCallback(() => {
    const newState = !isOpen
    if (controlledOpen === undefined) {
      setIsInternalOpen(newState)
    }
    onOpenChange?.(newState)
  }, [isOpen, controlledOpen, onOpenChange])

  const closeDropdown = useCallback(() => {
    if (controlledOpen === undefined) {
      setIsInternalOpen(false)
    }
    onOpenChange?.(false)
  }, [controlledOpen, onOpenChange])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, closeDropdown, updatePosition])

  return (
    <div className={cn(' inline-block ', className)} ref={dropdownRef}>
      <div onClick={toggleDropdown} className="w-full cursor-pointer" aria-expanded={isOpen} aria-haspopup="true">
        {typeof trigger === 'function' ? trigger(isOpen) : trigger}
      </div>
      {isMounted &&
        createPortal(
          <DropdownContent
            positionStyle={positionStyle}
            isOpen={isOpen}
            closeOnSelect={closeOnSelect}
            dropdownClassName={dropdownClassName}
            closeDropdown={closeDropdown}
            animationDuration={animationDuration}
            align={align}>
            {children}
          </DropdownContent>,
          portalRoot,
        )}
    </div>
  )
})

Dropdown.displayName = 'Dropdown'
DropdownContent.displayName = 'DropdownContent'
DropdownItem.displayName = 'DropdownItem'

export { DropdownItem }
