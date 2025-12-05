import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [loaded, setLoaded] = useState(false);

  // Cargar tema desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
      }
    } catch {
      console.warn("⚠ localStorage no disponible");
    } finally {
      setLoaded(true);
    }
  }, []);

  // Aplicar clase al <html>
  useEffect(() => {
    if (!loaded) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme, loaded]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // ⛑️ FIX CRÍTICO:
  // Nunca cortar el árbol de React. Siempre renderizar children.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {loaded ? children : children /* SIEMPRE renderiza children */}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
};
