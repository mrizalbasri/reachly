import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  hoverable?: boolean
}

export function Card({ children, hoverable = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`glass-card rounded-[16px] p-5 ${
        hoverable ? 'glass-card-hover cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
