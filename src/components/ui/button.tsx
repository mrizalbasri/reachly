import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-logo-gradient text-white hover:opacity-95 shadow-sm active:scale-98',
    secondary: 'bg-[#FBFBFC] text-[#1C1C1E] border border-[#EEEEF0] hover:bg-gray-100 active:scale-98',
    outline: 'border border-[#EEEEF0] text-[#1C1C1E] hover:bg-[#FBFBFC] active:scale-98',
    ghost: 'text-[#8E8E93] hover:text-[#1C1C1E] hover:bg-[#FBFBFC]',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-98',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs gap-2',
    lg: 'px-5 py-2.5 text-sm gap-2.5',
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
