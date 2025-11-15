// tailwind.config.cjs
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        'brand-500': 'rgb(37,112,255)',
        'brand-600': 'rgb(11,59,184)'
      }
    }
  },
  plugins: []
}
