import React, { useMemo, useRef, useEffect, useState } from 'react'
import { Code2, Terminal, Cpu } from 'lucide-react'

const techIcons = [Code2, Terminal, Cpu]

const TechDivider = ({ variant = 'default' }) => {
  const Icon = useMemo(() => {
    return techIcons[Math.floor(Math.random() * techIcons.length)]
  }, [])
  
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const el = ref.current
    if (!el) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  
  return (
    <div
      ref={ref}
      className={`tech-divider relative my-4 md:my-12 transition-[transform,opacity] duration-500 origin-center ${
        isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
      }`}
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20">
          <Icon className="w-4 h-4 text-primary-400" />
          <div className="h-1 w-1 rounded-full bg-primary-400" />
        </div>
      </div>
    </div>
  )
}

export default React.memo(TechDivider)

