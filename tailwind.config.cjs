module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: '#030303',
        surface: '#08111F',
        card: 'rgba(255,255,255,0.04)',
        emerald: '#00FFC6',
        cyan: '#00D4FF',
        gold: '#FFD166',
        text: '#F8FAFC',
        muted: '#94A3B8'
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [],
}
