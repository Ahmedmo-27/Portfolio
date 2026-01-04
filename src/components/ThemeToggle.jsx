import Sun from 'lucide-react/dist/esm/icons/sun'
import Moon from 'lucide-react/dist/esm/icons/moon-star'
import { useTheme } from '../context/ThemeContext'
import './ThemeToggle.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  // Use CSS variable for rotation so defaults live in CSS and are easy to tune
  const rotate = theme === 'dark' ? '0deg' : '180deg'

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle relative p-2.5 rounded-xl bg-surface border border-border hover:bg-surface-hover hover:scale-105 active:scale-95"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{ ['--theme-rotate']: rotate }}
    >
      <div className="theme-toggle-inner">
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-primary-400" />
        ) : (
          <Sun className="w-5 h-5 text-amber-500" />
        )}
      </div>
    </button>
  )
}

