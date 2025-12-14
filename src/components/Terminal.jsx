import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function Terminal({ 
  title = 'Terminal', 
  commands = [],
  className = '',
  showCopyButton = true 
}) {
  const [copied, setCopied] = useState(false)
  const [displayedCommands, setDisplayedCommands] = useState([])

  const handleCopy = () => {
    const text = commands.map(cmd => `$ ${cmd}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`terminal-window ${className}`}
    >
      <div className="pt-8 px-4 pb-4">
        {showCopyButton && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded text-muted hover:text-foreground transition-colors"
            aria-label="Copy terminal content"
          >
            {copied ? (
              <Check className="w-4 h-4 text-accent-emerald" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
        <div className="space-y-2 font-mono text-sm">
          {commands.map((command, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-2"
            >
              <span className="text-primary-400 select-none">$</span>
              <span className="text-foreground">{command}</span>
            </motion.div>
          ))}
          <div className="flex items-center gap-2 mt-4">
            <span className="text-primary-400 select-none">$</span>
            <span className="terminal-cursor" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

