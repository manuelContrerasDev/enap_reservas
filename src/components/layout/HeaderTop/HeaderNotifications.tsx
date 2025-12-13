// src/components/layout/HeaderTop/HeaderNotifications.tsx
import React, { useState } from "react";
import { Bell } from "lucide-react";

export default function HeaderNotifications() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          p-2 rounded-lg bg-white/10 hover:bg-white/20
          transition text-white relative
        "
      >
        <Bell size={18} />
        <span
          className="
            absolute top-1 right-1
            h-2.5 w-2.5 rounded-full bg-red-500 border border-white
            animate-pulse
          "
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-64 z-50
            bg-white text-gray-800 dark:bg-[#1f2937] dark:text-gray-100
            border dark:border-gray-700 shadow-xl
            rounded-lg p-3
          "
        >
          <h4 className="text-sm font-bold mb-2">Notificaciones</h4>

          <ul className="max-h-60 overflow-y-auto text-sm space-y-2">
            <li className="p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
              ✔ Tu reserva fue confirmada.
            </li>
            <li className="p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
              ⚠ Pago pendiente.
            </li>
            <li className="p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
              🏡 Nuevos espacios disponibles.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
