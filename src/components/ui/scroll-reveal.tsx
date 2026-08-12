import React, { useEffect, useRef, useState } from 'react'

type AnimationVariant = 'fade-up' | 'slide-left' | 'slide-right' | 'scale-in'

interface ScrollRevealProps {
  children: React.ReactNode
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  threshold?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 900,
  className = '',
  threshold = 0.1,
  once = true,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, once])

  const getHiddenStyles = () => {
    switch (variant) {
      case 'slide-left':
        return 'opacity-0 -translate-x-12'
      case 'slide-right':
        return 'opacity-0 translate-x-12'
      case 'scale-in':
        return 'opacity-0 scale-95 translate-y-6'
      case 'fade-up':
      default:
        return 'opacity-0 translate-y-10'
    }
  }

  const getVisibleStyles = () => {
    switch (variant) {
      case 'scale-in':
        return 'opacity-100 scale-100 translate-y-0'
      default:
        return 'opacity-100 translate-x-0 translate-y-0'
    }
  }

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity',
      }}
      className={`transition-all ${
        isVisible ? getVisibleStyles() : getHiddenStyles()
      } ${className}`}
    >
      {children}
    </div>
  )
}
