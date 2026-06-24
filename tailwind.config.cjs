module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#030303',
        surface: '#08111F',
        'surface-hover': '#0D1728',
        primary: '#00FFC6',
        secondary: '#00D4FF',
        accent: '#FFD166',
        text: '#F8FAFC',
        muted: '#94A3B8',
        border: 'rgba(255,255,255,0.08)'
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(0, 255, 198, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.4)',
        'accent-glow': '0 0 20px 2px rgba(255, 209, 102, 0.15)',
        'primary-glow': '0 0 20px 2px rgba(0, 255, 198, 0.2)'
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-normal': 'floatNormal 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'aurora-wave': 'auroraWave 20s linear infinite alternate'
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-15px) rotate(1deg)' }
        },
        floatNormal: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' }
        },
        auroraWave: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '100%': { transform: 'translate3d(60px, -40px, 0) scale(1.1)' }
        }
      }
    }
  },
  plugins: [],
}
