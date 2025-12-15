import { useState, useEffect, useRef } from 'react'
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
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    } else if (!isComplete) {
      setIsComplete(true)
      if (onCompleteRef.current) onCompleteRef.current()
    }
  }, [currentIndex, text, speed, isComplete])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && (
        <span className="terminal-cursor inline-block ml-1" />
      )}
    </span>
  )
}

