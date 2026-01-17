// src/components/layout/HeaderTop/HeaderDarkMode.tsx
import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function HeaderDarkMode() {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia previa
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const active = stored === "dark" || (!stored && prefers);
    setDarkMode(active);

    if (active) document.documentElement.classList.add("dark");
  }, []);

  const toggleDark = () => {
    const newState = !darkMode;
    setDarkMode(newState);

    document.documentElement.classList.toggle("dark", newState);
    localStorage.setItem("theme", newState ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleDark}
      className="
        p-2 rounded-lg
        bg-white/10 hover:bg-white/20
        transition text-white
      "
      aria-label="Cambiar tema"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
