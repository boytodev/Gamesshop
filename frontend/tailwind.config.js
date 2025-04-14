
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gaming-cyan': 'var(--gaming-cyan)',
        'gaming-blue': 'var(--gaming-blue)',
        'gaming-purple': 'var(--gaming-purple)',
      },
    },
  },
  plugins: [],
}
