/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', "class"],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			'card-foreground': 'var(--color-card-foreground)',
  			surface: 'var(--color-surface)',
  			'surface-hover': 'var(--color-surface-hover)',
  			border: 'hsl(var(--border))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			primary: {
  				'50': '#f0f9ff',
  				'100': '#e0f2fe',
  				'200': '#bae6fd',
  				'300': '#7dd3fc',
  				'400': '#38bdf8',
  				'500': '#0ea5e9',
  				'600': '#0284c7',
  				'700': '#0369a1',
  				'800': '#075985',
  				'900': '#0c4a6e',
  				'950': '#082f49',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			dark: {
  				'50': '#f8fafc',
  				'100': '#f1f5f9',
  				'200': '#e2e8f0',
  				'300': '#cbd5e1',
  				'400': '#94a3b8',
  				'500': '#64748b',
  				'600': '#475569',
  				'700': '#334155',
  				'800': '#1e293b',
  				'900': '#0f172a',
  				'950': '#020617'
  			},
  			accent: {
  				cyan: '#06b6d4',
  				emerald: '#10b981',
  				violet: '#8b5cf6',
  				amber: '#f59e0b',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Outfit',
  				'system-ui',
  				'sans-serif'
  			],
  			display: [
  				'Syne',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Fira Code',
  				'monospace'
  			]
  		},
  		animation: {
  			gradient: 'gradient 8s ease infinite',
  			float: 'float 6s ease-in-out infinite',
  			'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			shimmer: 'shimmer 2s linear infinite',
  			'spin-slow': 'spin 8s linear infinite',
  			'typing': 'typing 3.5s steps(40, end), blink-cursor 0.75s step-end infinite',
  			'glitch': 'glitch 0.3s infinite',
  			'matrix-rain': 'matrix-rain linear infinite',
  			'scan-line': 'scan-line 3s linear infinite',
  			'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
  			'terminal-blink': 'terminal-blink 1s infinite'
  		},
  		keyframes: {
  			gradient: {
  				'0%, 100%': {
  					backgroundPosition: '0% 50%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-20px)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					backgroundPosition: '-200% 0'
  				},
  				'100%': {
  					backgroundPosition: '200% 0'
  				}
  			},
  			typing: {
  				from: { width: '0' },
  				to: { width: '100%' }
  			},
  			'blink-cursor': {
  				'from, to': { borderColor: 'transparent' },
  				'50%': { borderColor: '#0ea5e9' }
  			},
  			glitch: {
  				'0%, 100%': { transform: 'translate(0)' },
  				'20%': { transform: 'translate(-2px, 2px)' },
  				'40%': { transform: 'translate(-2px, -2px)' },
  				'60%': { transform: 'translate(2px, 2px)' },
  				'80%': { transform: 'translate(2px, -2px)' }
  			},
  			'matrix-rain': {
  				'0%': { transform: 'translateY(-100%)', opacity: '0' },
  				'10%': { opacity: '1' },
  				'90%': { opacity: '1' },
  				'100%': { transform: 'translateY(100vh)', opacity: '0' }
  			},
  			'scan-line': {
  				'0%': { transform: 'translateY(-100%)' },
  				'100%': { transform: 'translateY(100vh)' }
  			},
  			'pulse-glow': {
  				'0%, 100%': {
  					boxShadow: '0 0 5px rgba(14, 165, 233, 0.5), 0 0 10px rgba(14, 165, 233, 0.3), 0 0 15px rgba(14, 165, 233, 0.2)'
  				},
  				'50%': {
  					boxShadow: '0 0 10px rgba(14, 165, 233, 0.8), 0 0 20px rgba(14, 165, 233, 0.5), 0 0 30px rgba(14, 165, 233, 0.3)'
  				}
  			},
  			'terminal-blink': {
  				'0%, 50%': { opacity: '1' },
  				'51%, 100%': { opacity: '0' }
  			}
  		},
  		backgroundSize: {
  			'300%': '300%'
  		},
  		boxShadow: {
  			glow: '0 0 20px rgba(14, 165, 233, 0.3)',
  			'glow-lg': '0 0 40px rgba(14, 165, 233, 0.4)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
