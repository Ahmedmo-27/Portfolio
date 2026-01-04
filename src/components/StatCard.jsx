import React from 'react'
import batchSetProperty from '../utils/batchStyle'

export default function StatCard({ stat, index }) {
  return (
    <div
      key={stat.label}
      ref={(el) => {
        if (el) batchSetProperty(el, '--animation-delay', `${index * 0.1 + 0.3}s`)
      }}
      className='relative group transition-all duration-300 hover:-translate-y-2 hover:scale-105 about-stat-item'
    >
      <div className="text-center p-5 md:p-6 rounded-2xl glass-card h-full relative overflow-hidden border-2 border-primary-500/20 group-hover:border-primary-500/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary-500/20" title={stat.tooltip || ''}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" aria-hidden="true" />
        <div className={`relative w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 rounded-xl bg-surface flex items-center justify-center ${stat.color} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
          <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <div className="relative text-2xl md:text-3xl font-display font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
        <div className="relative text-xs md:text-sm text-muted font-semibold group-hover:text-foreground/90 transition-colors duration-300">{stat.label}</div>
        {stat.tooltip && (
          <div className="relative mt-2 text-[10px] md:text-xs text-muted-foreground italic leading-relaxed">{stat.tooltip}</div>
        )}
      </div>
    </div>
  )
}
