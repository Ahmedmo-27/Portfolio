import React from 'react'
import './CircuitBoard.css'

const CircuitBoard = ({ className = '' }) => {
  return (
    <div className={`circuit-board ${className}`} aria-hidden="true">
      {/* Additional circuit nodes */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="circuit-pattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <circle cx="25" cy="25" r="1" fill="currentColor" className="text-primary-500" />
            <line x1="0" y1="25" x2="50" y2="25" stroke="currentColor" strokeWidth="0.5" className="text-primary-500/30" />
            <line x1="25" y1="0" x2="25" y2="50" stroke="currentColor" strokeWidth="0.5" className="text-primary-500/30" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  )
}

export default React.memo(CircuitBoard)

