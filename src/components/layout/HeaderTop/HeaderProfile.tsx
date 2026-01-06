// src/components/layout/HeaderTop/HeaderProfile.tsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/auth";
import { PATHS } from "@/routes/paths";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeaderProfile() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);

  const initials = user?.name?.substring(0, 1).toUpperCase() ?? "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-lg transition"
      >
        {/* Avatar circular */}
        <div className="h-8 w-8 rounded-full bg-[#01485E] text-white flex items-center justify-center font-semibold">
          {initials}
        </div>

        <ChevronDown className="h-4 w-4 text-gray-600" />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg
            shadow-lg py-2 z-30 animate-fadeIn
          "
        >
          <button
            onClick={() => navigate(PATHS.SOCIO_HOME)}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
          >
            Mi Perfil
          </button>

          <button
            onClick={() => {
              logout();
              window.location.href = PATHS.AUTH_LOGIN;
            }}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm text-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
