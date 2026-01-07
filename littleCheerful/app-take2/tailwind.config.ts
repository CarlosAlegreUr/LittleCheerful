import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			parchment: {
  				light: '#F4ECD8',
  				dark: '#1A1410'
  			},
  			crimson: {
  				light: '#8B0000',
  				dark: '#6B2020'
  			},
  			marble: {
  				light: '#F8F8FF',
  				dark: '#252030'
  			},
  			gold: {
  				light: '#DAA520',
  				dark: '#B8860B'
  			},
  			ink: {
  				light: '#2C1810',
  				dark: '#E8DFC8'
  			},
  			laurel: {
  				light: '#2E6F2E',
  				dark: '#4A8F4A'
  			},
  			waxSeal: {
  				light: '#B8710D',
  				dark: '#D4932F'
  			},
  			blood: {
  				light: '#9B1C1C',
  				dark: '#C23B3B'
  			},
  			lapis: {
  				light: '#1E4D8B',
  				dark: '#3B6FAF'
  			},
  			// Semantic aliases
  			success: {
  				light: '#2E6F2E',
  				dark: '#4A8F4A'
  			},
  			warning: {
  				light: '#B8710D',
  				dark: '#D4932F'
  			},
  			danger: {
  				light: '#9B1C1C',
  				dark: '#C23B3B'
  			},
  			info: {
  				light: '#1E4D8B',
  				dark: '#3B6FAF'
  			},
  			disabled: '#968A76',
  			'border-medium': {
  				light: '#B8A888',
  				dark: '#524435'
  			},
  			border: 'hsl(var(--border))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
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
  			body: [
  				'var(--font-crimson-text)',
  				'Georgia',
  				'Times New Roman',
  				'serif'
  			],
  			display: [
  				'var(--font-eb-garamond)',
  				'Garamond',
  				'Georgia',
  				'serif'
  			],
  			mono: [
  				'var(--font-jetbrains-mono)',
  				'Fira Code',
  				'Consolas',
  				'monospace'
  			]
  		},
  		spacing: {
  			xs: '0.25rem',
  			sm: '0.5rem',
  			md: '1rem',
  			lg: '1.5rem',
  			xl: '2rem',
  			'2xl': '3rem',
  			'3xl': '4rem'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			draw: {
  				'0%': { strokeDashoffset: '1000' },
  				'100%': { strokeDashoffset: '0' }
  			}
  		},
  		animation: {
  			draw: 'draw 1.2s ease-in infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
