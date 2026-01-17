// src/components/layout/Sidebar/SidebarFooter.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function SidebarFooter({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // limpia storage + headers
    navigate(PATHS.AUTH_LOGIN, { replace: true });
  };

  return (
    <footer className="p-4 border-t border-white/10">
      <button
        onClick={handleLogout}
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
