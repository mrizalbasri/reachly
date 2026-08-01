import React from 'react'

export type PipelineStatus = 'prospek' | 'outreach' | 'nego' | 'deal' | 'posting' | 'selesai'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  status?: PipelineStatus
  variant?: 'default' | 'outline' | 'status'
}

export function Badge({
  children,
  status,
  variant = 'default',
  className = '',
  ...props
}: BadgeProps) {
  if (status) {
    const statusClasses: Record<PipelineStatus, string> = {
      prospek: 'badge-prospek',
      outreach: 'badge-outreach',
      nego: 'badge-nego',
      deal: 'badge-deal',
      posting: 'badge-posting',
      selesai: 'badge-selesai',
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide capitalize ${statusClasses[status]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }

  const variants = {
    default: 'bg-[#FBFBFC] text-[#1C1C1E] border border-[#EEEEF0]',
    outline: 'border border-[#EEEEF0] text-[#8E8E93]',
    status: 'bg-purple-100 text-[#7C3AED]',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
