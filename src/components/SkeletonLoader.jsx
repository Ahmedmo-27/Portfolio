import './SkeletonLoader.css'

export default function SkeletonLoader({ className = '', variant = 'image' }) {
  const baseClasses = "animate-pulse bg-gradient-to-r from-surface via-surface-hover to-surface bg-[length:200%_100%]"
  
  // Section variant renders a more complex skeleton
  if (variant === 'section') {
    return (
      <div
        className={`space-y-8 animate-fade-in ${className}`}
        role="status"
        aria-label="Loading section..."
      >
        {/* Section header skeleton */}
        <div className="text-center space-y-4">
          <div className={`${baseClasses} h-6 w-32 rounded-full mx-auto skeleton-shimmer`} />
          <div className={`${baseClasses} h-10 w-64 rounded-lg mx-auto skeleton-shimmer`} />
          <div className={`${baseClasses} h-4 w-96 max-w-full rounded-md mx-auto skeleton-shimmer`} />
        </div>
        
        {/* Content grid skeleton */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => {
            const delayClasses = [
              'skeleton-shimmer-delay-1',
              'skeleton-shimmer-delay-2',
              'skeleton-shimmer-delay-3',
              'skeleton-shimmer-delay-4',
              'skeleton-shimmer-delay-5',
              'skeleton-shimmer-delay-6'
            ]
            return (
              <div 
                key={i} 
                className={`${baseClasses} h-48 rounded-2xl ${delayClasses[i - 1]}`}
              />
            )
          })}
        </div>
        <span className="sr-only">Loading section...</span>
      </div>
    )
  }
  
  const variants = {
    image: "aspect-video rounded-xl",
    text: "h-4 rounded-md",
    card: "h-48 rounded-2xl",
    avatar: "w-24 h-24 rounded-full",
  }

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className} skeleton-shimmer animate-fade-in`}
      role="status"
      aria-label="Loading..."
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Media placeholder with skeleton loading state
export function MediaSkeleton({ isLoading = true, children, className = '' }) {
  if (isLoading) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${className}`}>
        <div className="aspect-video bg-surface animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}

