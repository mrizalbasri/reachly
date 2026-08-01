import React from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] shadow-2xl border border-[#EEEEF0] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#EEEEF0]">
          <h3 className="font-bold text-lg text-[#1C1C1E]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FBFBFC] border border-[#EEEEF0] flex items-center justify-center text-[#8E8E93] hover:text-[#1C1C1E] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
