/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#ec4899", // Pink 500 - brighter, more modern pink
        "primary-dark": "#be185d",
        "primary-hover": "#db2777", // Pink 600
        "primary-light": "#fce7f3", // Pink 100
        "primary-soft": "#fdf2f8", // Pink 50
        secondary: "#fce7f3",
        "accent-rose": "#fda4af", // Rose 300
        "background-light": "#fff1f2", // Rose 50
        "background-dark": "#1f1016",
        "background-white": "#ffffff",
        "text-main": "#4b5563", // Gray 600
        "text-heading": "#831843", // Pink 900
        "neutral-light": "#fafafa", 
        "neutral-border": "#f3f4f6",
        "medicure-pink": "#ec4899",
        "medicure-pink-dark": "#be185d",
        "medicure-pink-light": "#fce7f3",
        "medicure-bg": "#fdf2f8",
        "text-dark": "#1f2937",
        "text-muted": "#6b7280",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        display: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        '2xl': "2rem",
        '3xl': "2.5rem",
        full: "9999px"
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(236, 72, 153, 0.15)',
        'glow': '0 0 20px rgba(251, 113, 133, 0.25)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'auth-soft': '0 4px 20px -2px rgba(236, 72, 153, 0.1)',
        'auth-glow': '0 0 15px rgba(236, 72, 153, 0.3)'
      }
    },
  },
  plugins: [],
}
