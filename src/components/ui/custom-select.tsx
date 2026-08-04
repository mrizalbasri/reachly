import { useState, useRef, useEffect, type ReactNode } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  icon?: ReactNode
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Pilih...',
  className = '',
  icon,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-xs py-1.5 pl-3 pr-8 rounded-xl border border-[#EEEEF0] bg-[#FBFBFC] hover:bg-white text-[#1C1C1E] font-medium cursor-pointer hover:border-[#7C3AED]/40 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 transition-all shadow-2xs flex items-center gap-1.5 justify-between"
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon}
          <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8E8E93] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#7C3AED]' : ''}`} />
      </button>

      {/* Floating Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full min-w-[170px] max-h-60 overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl border border-[#EEEEF0] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y-0">
          {options.map((opt) => {
            const isSelected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-xs rounded-xl font-medium flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-50 text-[#7C3AED] font-bold'
                    : 'text-[#1C1C1E] hover:bg-gray-100/80 hover:text-[#7C3AED]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
