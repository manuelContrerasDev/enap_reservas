/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "enap-primary": "#DEC01F",   // Amarillo institucional
        "enap-secondary": "#002E3E", // Azul petróleo
        "enap-bg": "#F9FAFB",
        "enap-text": "#1A1A1A",
        "enap-accent": "#E8CF4F",
        "enap-muted": "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        inner: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        // 🌅 Gradientes institucionales
        "enap-primary": "linear-gradient(to bottom right, #002E3E, #DEC01F)",
        "enap-accent": "linear-gradient(to bottom right, #004F61, #E8CF4F)",
        "enap-soft": "linear-gradient(to bottom right, #003B4C, #00A0A0)",
      },
    },
  },
  plugins: [],
};
