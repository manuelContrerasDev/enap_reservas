/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      /* =====================================================
       * 🎨 PALETA ENAP — THEME OFICIAL
       * ===================================================== */
      colors: {
        enap: {
          primary: "#002E3E",
          primaryDark: "#001E2A",
          secondary: "#004659",

          gold: "#C7A96A",
          goldDark: "#b09058",

          bg: "#F2F4F5",
          white: "#FFFFFF",

          text: "#1A1A1A",
          textLight: "#6B6B6B",
        },

        /* Estados */
        success: "#2ECC71",
        warning: "#F1C40F",
        error: "#E74C3C",

        /* =====================================================
         * 🎨 LEGACY COLORS (NO BORRAR POR AHORA)
         * Se usan en algunos componentes antiguos
         * ===================================================== */
        "enap-primary": "#DEC01F",
        "enap-secondary": "#002E3E",
        "enap-bg": "#F9FAFB",
        "enap-text": "#1A1A1A",
        "enap-accent": "#E8CF4F",
        "enap-muted": "#E5E7EB",

        /* =====================================================
         * 🎨 CIAN MODERNO CORPORATIVO
         * ===================================================== */
        cian: {
          50: "#E3F7FF",
          100: "#C5ECFA",
          200: "#9EDFF7",
          300: "#6ACDF3",
          400: "#3DBBE9",
          500: "#00A5DB",
          600: "#0088CC",
          700: "#006DA8",
          800: "#005985",
          900: "#003A57",
        },

        azul: {
          100: "#E5EEF1",
          200: "#C3D6DD",
          300: "#9EBAC6",
          400: "#6D94A6",
          500: "#3A6F84",
          600: "#003B4D",
          700: "#002E3E",
          800: "#001C26",
          900: "#00121A",
        },

        gold: {
          DEFAULT: "#DEC01F",
          dark: "#C5A619",
        },
      },

      /* =====================================================
       * 🅰 TIPOGRAFÍA OFICIAL
       * ===================================================== */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      /* =====================================================
       * 🕶 SOMBRAS CORPORATIVAS
       * ===================================================== */
      boxShadow: {
        enapSm: "0 2px 4px rgba(0,0,0,0.06)",
        enapMd: "0 4px 12px rgba(0,0,0,0.08)",
        enapLg: "0 8px 18px rgba(0,0,0,0.12)",

        /* legacy */
        soft: "0 4px 20px rgba(0, 0, 0, 0.05)",
        inner: "inset 0 2px 8px rgba(0, 0, 0, 0.05)",
        "cian-glow": "0 0 14px rgba(0, 136, 204, 0.35)",
      },

      /* =====================================================
       * 🌅 GRADIENTES OFICIALES
       * ===================================================== */
      backgroundImage: {
        "enap-gradient":
          "linear-gradient(135deg, #002E3E, #004659)",
        "enap-gold-gradient":
          "linear-gradient(135deg, #C7A96A, #b09058)",

        /* Headers corporativos */
        "enap-header":
          "linear-gradient(to right, #002E3E, #005D73, #0088CC)",

        /* botón cian */
        "cian-btn": "linear-gradient(to right, #0088CC, #00A5DB)",

        /* legacy */
        "cian-card": "linear-gradient(145deg, #E3F7FF, #C5ECFA)",
      },

      /* =====================================================
       * 🟦 RADIOS
       * ===================================================== */
      borderRadius: {
        enap: "12px",
      },
    },
  },
  plugins: [],
};
