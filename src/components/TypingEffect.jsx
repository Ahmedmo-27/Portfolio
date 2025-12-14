import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function TypingEffect({ 
  text, 
  speed = 100,
  className = '',
  showCursor = true,
  onComplete 
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      if (onComplete) onComplete()
    }
  }, [currentIndex, text, speed, isComplete, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className="terminal-cursor inline-block ml-1" />
      )}
    </span>
  )
}

