import type React from 'react'
import { useCallback, useState, useRef } from 'react'
import { cn } from '@/shared/utils/cn'
import type { DropzoneProps } from '@/shared/types/ui'

export const Dropzone: React.FC<DropzoneProps> = ({ onFilesDrop, multiple = true, accept, className, disabled = false, children }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      if (disabled) return
      const files = Array.from(event.dataTransfer.files)
      console.log('Dropzone handleDrop called with files:', files)
      if (onFilesDrop) onFilesDrop(files)
    },
    [onFilesDrop, disabled],
  )

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const files = event.target.files ? Array.from(event.target.files) : []
    console.log('Dropzone handleFileSelect called with files:', files)
    if (onFilesDrop) onFilesDrop(files)

    event.target.value = ''
  }

  const handleClick = () => {
    if (disabled) return
    console.log('Dropzone clicked, triggering file input')
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        `flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors`,
        className,
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled) setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}>
      <input
        ref={fileInputRef}
        type="file"
        hidden
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      {children || (
        <p className="text-gray-600 text-sm">
          {isDragging ? 'Drop files here...' : 'Drag and drop files here or click to upload'}
        </p>
      )}
    </div>
  )
}
