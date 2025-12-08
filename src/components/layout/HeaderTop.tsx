import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth";
import { LogOut, Bell, Moon, Sun } from "lucide-react";

export default function HeaderTop() {
  const { user, logout } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // ============================
  // DARK MODE PERSISTENCIA
  // ============================
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

  // ============================
  // RETORNO SI NO HAY USER
  // ============================
  if (!user) return null;

  return (
    <header
      className="
        sticky top-0 z-40 w-full 
        bg-[#002E3E]/95
        text-white backdrop-blur-sm 
        shadow-md border-b border-[#003B4D]/40
        flex items-center justify-between px-6 py-3
      "
    >
      {/* LOGO / TITULO */}
      <h1 className="text-lg font-semibold">
        
      </h1>

      {/* ACCIONES */}
      <div className="flex items-center gap-3">

        {/* BOTÓN DARK MODE */}
        <button
          onClick={toggleDark}
          className="
            p-2 rounded-lg
            bg-white/10 hover:bg-white/20
            text-white transition-all
          "
          aria-label="Cambiar tema"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* NOTIFICACIONES */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="
              p-2 rounded-lg
              bg-white/10 hover:bg-white/20
              text-white transition
              relative
            "
            aria-label="Ver notificaciones"
          >
            <Bell size={18} />

            {/* BADGE */}
            <span
              className="
                absolute top-1 right-1
                h-2.5 w-2.5 rounded-full
                bg-red-500 border border-white
                animate-pulse
              "
            />
          </button>

          {/* PANEL DE NOTIFICACIONES */}
          {showNotifications && (
            <div
              className="
                absolute right-0 mt-2 w-64 
                bg-white dark:bg-[#1f2937]
                text-gray-800 dark:text-gray-100 
                shadow-xl rounded-lg border dark:border-gray-700
                p-3 z-50
              "
            >
              <h4 className="text-sm font-bold mb-2">
                Notificaciones
              </h4>

              <ul className="max-h-60 overflow-y-auto text-sm space-y-2">

                <li className="p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                  ✔ Tu reserva fue confirmada.
                </li>

                <li className="p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                  ⚠ Recordatorio: tienes un pago pendiente.
                </li>

                <li className="p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
                  🏡 Nuevos espacios disponibles en tu área.
                </li>

              </ul>
            </div>
          )}
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="
            flex items-center gap-2
            bg-[#FFD84D] text-[#003B4D]
            px-4 py-2 rounded-lg text-sm font-semibold
            hover:bg-[#FFE28A]
            transition active:scale-[0.97]
          "
        >
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </header>
  );
}
