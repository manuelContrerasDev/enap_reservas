// src/components/layout/Sidebar/SidebarFooter.tsx
import React from "react";
import { PATHS } from "@/routes/paths";

export default function SidebarFooter({
  onLogout,
}: {
  onLogout: () => void;
}) {
  return (
    <footer className="p-4 border-t border-white/10">
      <button
        onClick={() => {
          onLogout();
          window.location.href = PATHS.AUTH_LOGIN;
        }}
        className="
          w-full py-2 rounded-lg text-sm font-semibold
          bg-[#FFD84D] text-[#003B4D]
          transition-all duration-200
          hover:bg-[#FFE28A] hover:shadow-md
          active:scale-95
        "
      >
        Cerrar sesión
      </button>
    </footer>
  );
}
