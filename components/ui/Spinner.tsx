'use client'
import React from 'react'
import { cn } from '@/lib/utils'

type SpinnerProps = {
  text?: string
  size?: number
  className?: string
}

export const Spinner = ({ text, size = 20, className }: SpinnerProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className="animate-spin rounded-full border-2 border-t-transparent border-current"
        style={{ width: size, height: size }}
      />
      {text && <span>{text}</span>}
    </div>
  )
}
