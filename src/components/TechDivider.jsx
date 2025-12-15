import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Code2, Terminal, Cpu } from 'lucide-react'

const techIcons = [Code2, Terminal, Cpu]

const TechDivider = ({ variant = 'default' }) => {
  const Icon = useMemo(() => {
    return techIcons[Math.floor(Math.random() * techIcons.length)]
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="tech-divider relative my-8 md:my-12"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20">
          <Icon className="w-4 h-4 text-primary-400" />
          <div className="h-1 w-1 rounded-full bg-primary-400 animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}

export default React.memo(TechDivider)

