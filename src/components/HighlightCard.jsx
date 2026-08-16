import React from 'react'

export default function HighlightCard({ item, featured }) {
  return (
    <div
      key={item.title}
      className={`${featured ? 'mt-3' : ''} glass-card p-4 group/card relative overflow-hidden transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-primary-500/20 hover:border-primary-500/50 about-highlight-item gsap-reveal-item shadow-md`}
      {...(featured ? {} : { role: 'listitem' })}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover/card:opacity-15 transition-opacity duration-300`} aria-hidden="true" />
      <div className="flex items-start gap-3">
        <div className={`relative w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover/card:scale-110 group-hover/card:shadow-xl transition-transform transition-shadow duration-300`} aria-hidden="true">
          <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="relative text-foreground font-bold mb-1 text-sm md:text-base">{item.title}</h3>
          <p className="relative text-xs md:text-sm text-muted leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  )
}
