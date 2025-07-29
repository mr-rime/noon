import type React from 'react'
import { memo } from 'react'
import { cn } from '../../utils/cn'

interface SeparatorProps {
  className?: string
}

export const Separator: React.FC<SeparatorProps> = memo(({ className }) => {
  return <div className={cn(` h-[1px] w-full bg-[#EAECF0]`, className)} />
})
