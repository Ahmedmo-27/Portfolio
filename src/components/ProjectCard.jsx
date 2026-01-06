import React, { lazy, Suspense } from 'react'
// animation delays set by parent; avoid runtime writes here
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import { MediaSkeleton } from './SkeletonLoader'

const MediaCarousel = lazy(() => import('./MediaCarousel'))

function parseBoldMarkdown(text) {
  if (!text) return ''
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

export default function ProjectCard({ project, index, mediaShouldLoad, activeProject, setActiveProject }) {
  return (
    <article
      key={project.id}
      data-project-id={project.id}
      style={{ ['--animation-delay']: `${index * 0.15 + 0.2}s` }}
      className={`${project.isHighlighted ? 'relative' : ''} projects-item `}
      role="listitem"
      aria-labelledby={`project-title-${project.id}`}
    >
      {project.isHighlighted && (
        <div className="absolute -top-3 left-6 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-amber text-dark-900 text-xs font-bold shadow-lg">
            ⭐ Featured Project
          </span>
        </div>
      )}

      <div
        className={`glass-card overflow-hidden group transition-transform hover:-translate-y-1 focus-visible:-translate-y-1 ${project.isHighlighted ? 'ring-2 ring-accent-amber/30' : ''}`}
        tabIndex={0}
        role="article"
      >
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="relative bg-surface/50 p-4 sm:p-6">
              <div className="aspect-video rounded-xl bg-surface overflow-hidden relative">
              <Suspense fallback={<MediaSkeleton className="w-full h-full" aria-hidden="true" />}>
                <MediaCarousel project={project} shouldLoad={index === 0 || mediaShouldLoad[project.id]} />
              </Suspense>
            </div>

            {project.award && (
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-accent-amber/90 border border-accent-amber text-dark-900 text-[10px] sm:text-xs font-semibold backdrop-blur-sm shadow-lg">
                  🏆 <span className="hidden sm:inline">{project.award}</span>
                  <span className="sm:hidden">Award</span>
                </span>
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center flex-shrink-0 shadow-lg`} aria-hidden="true">
                  <project.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 id={`project-title-${project.id}`} className="text-lg sm:text-xl font-display font-bold text-foreground line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-primary-400 text-xs sm:text-sm font-medium line-clamp-2">
                    {project.subtitle}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted text-sm sm:text-base mb-3">
              {project.description}
            </p>

            {(project.impact || project.role) && (
              <div className="mb-4 space-y-2">
                {project.impact && (
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-accent-emerald font-semibold flex-shrink-0">Impact:</span>
                    <span className="text-muted" dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(project.impact) }} />
                  </div>
                )}
                {project.role && (
                  <div className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="text-accent-cyan font-semibold flex-shrink-0">Role:</span>
                    <span className="text-muted" dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(project.role) }} />
                  </div>
                )}
              </div>
            )}

            <div className="mb-4">
              <button
                onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
                className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 focus-visible:text-primary-300 transition-colors"
                aria-expanded={activeProject === project.id}
                aria-controls={`features-${project.id}`}
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${activeProject === project.id ? 'rotate-90' : ''}`} aria-hidden="true" />
                Technical Details
              </button>
              {activeProject === project.id && (
                <ul id={`features-${project.id}`} className="mt-3 space-y-2 pl-6 animate-fade-in-up" role="list">
                  {project.features.map((feature, i) => (
                    <li key={`${project.id}-feature-${i}`} className="flex items-start gap-2 text-muted text-xs sm:text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-1.5 flex-shrink-0" aria-hidden="true" />
                      <span dangerouslySetInnerHTML={{ __html: parseBoldMarkdown(feature) }} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-auto mb-3">
              {project.tech.map((tech) => (
                <span key={tech} className="tech-tag text-xs">
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border">
              {project.ctas.map((cta) => {
                const Icon = cta.icon
                return (
                  <a key={cta.label} href={cta.href} target={cta.href.startsWith('http') ? '_blank' : undefined} rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="btn-cta">
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {cta.label}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
