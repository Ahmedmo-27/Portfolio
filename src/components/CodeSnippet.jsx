import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function CodeSnippet({ 
  code, 
  language = 'javascript',
  className = '',
  showLineNumbers = true,
  showCopyButton = true 
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lines = code.split('\n')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`code-block relative ${className}`}
    >
      {showCopyButton && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded text-muted hover:text-foreground transition-colors z-10"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-accent-emerald" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      )}
      <div className="flex items-center gap-2 mb-2 text-xs text-muted">
        <span className="px-2 py-0.5 rounded bg-surface border border-border">
          {language}
        </span>
      </div>
      <pre className="font-mono text-sm overflow-x-auto">
        <code className="text-foreground">
          {showLineNumbers ? (
            <div className="flex">
              <div className="select-none text-muted pr-4 text-right">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="flex-1">
                {lines.map((line, i) => (
                  <div key={i}>{line || ' '}</div>
                ))}
              </div>
            </div>
          ) : (
            code
          )}
        </code>
      </pre>
    </motion.div>
  )
}

