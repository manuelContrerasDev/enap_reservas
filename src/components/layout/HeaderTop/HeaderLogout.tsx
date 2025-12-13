// src/components/layout/HeaderTop/HeaderLogout.tsx
import React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/auth";
import { PATHS } from "@/routes/paths";

export default function HeaderLogout() {
  const { logout } = useAuth();

  return (
    <button
      onClick={() => {
        logout();
        window.location.href = PATHS.AUTH_LOGIN;
      }}
      className="
        flex items-center gap-2
        bg-[#FFD84D] text-[#003B4D]
        px-4 py-2 rounded-lg text-sm font-semibold
        hover:bg-[#FFE28A] transition active:scale-[0.97]
      "
    >
      <LogOut size={18} />
      Salir
    </button>
  );
}
