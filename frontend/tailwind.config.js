module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "brand-500": "rgb(37,112,255)",
        "brand-600": "rgb(11,59,184)",
        "unicorn": {
          "pink": "#ff9ee0",
          "purple": "#c77dff",
          "blue": "#7dd3fc",
          "mint": "#7ae5f0",
          "lavender": "#b794f6",
          "peach": "#fda4af",
          "yellow": "#fde68a"
        }
      }
    }
  },
  plugins: []
}
