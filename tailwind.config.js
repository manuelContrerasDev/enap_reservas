/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "enap-primary": "#DEC01F",
        "enap-secondary": "#002E3E",
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
    },
  },
  plugins: [],
};
