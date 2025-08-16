import { X } from 'lucide-react'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { animateElement } from '../../../utils/animateElement'
import { cn } from '@/utils/cn'

type ModalDialogProps = {
  onClose: () => void
  header?: ReactNode
  content?: ReactNode
  footer?: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
  closeButtonClassName?: string
}

export function ModalDialog({
  onClose,
  header,
  content,
  footer,
  className,
  contentClassName,
  footerClassName,
  headerClassName,
  closeButtonClassName,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    if (isClosing) return
    setIsClosing(true)
    if (dialogRef.current && overlayRef.current) {
      const animations = [
        animateElement(overlayRef.current, [{ opacity: 0.5 }, { opacity: 0 }], { duration: 150 }),
        animateElement(
          dialogRef.current,
          [
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0, transform: 'scale(0.95)' },
          ],
          { duration: 200 },
        ),
      ]
      Promise.all(animations.map((a) => a.finished)).then(onClose)
    } else {
      onClose()
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  if (typeof window === 'undefined') return null

  return createPortal(
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9998] bg-black opacity-50"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleClose()
        }}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          className={cn('relative w-[400px] overflow-hidden rounded-lg bg-white outline-none', className)}
          onClick={(e) => {
            e.stopPropagation()
          }}>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleClose()
            }}
            className={cn(
              'absolute top-3 right-3 z-10 cursor-pointer rounded-full p-2 transition-colors hover:bg-gray-200',
              closeButtonClassName,
            )}
            aria-label="Close dialog">
            <X />
          </button>
          {header && <div className={cn(headerClassName)}>{header}</div>}
          <div className="flex flex-col justify-between">
            {content && <div className={cn(contentClassName)}>{content}</div>}
            {footer && <div className={cn(footerClassName)}>{footer}</div>}
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}
