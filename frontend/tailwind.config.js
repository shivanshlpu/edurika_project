/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,  // ← HARD DISABLE dark mode
  content: ["./index.html", "./src/**/*.{jsx,js,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        }
      }
    }
  },
  plugins: [],
}
