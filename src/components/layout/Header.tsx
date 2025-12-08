import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Sun, Moon } from "lucide-react";

import { PATHS } from "../../routes/paths";
import { useAuth } from "@/context/auth";
import { useTheme } from "../../context/ThemeContext";
import logoEnap from "../../assets/logo-enap.png";

interface HeaderProps {
  variants: any;
  onRouteChange: () => void;
  extraActions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  variants,
  onRouteChange,
  extraActions,
}) => {
  
  const { user, role, logout } = useAuth();
  const userRole = role;               // "ADMIN" | "SOCIO" | "EXTERNO" | null
  const userName = user?.name ?? "";   // string o vacío

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      logout();
      window.location.href = PATHS.AUTH_LOGIN;
    }
  }, [logout]);

  return (
    <motion.header
      variants={variants.header}
      initial="initial"
      animate="animate"
      className={`
        sticky top-0 z-50 shadow-md border-b border-enap-primary/30
        ${isDark 
          ? "bg-[#001C26] text-white" 
          : "bg-gradient-to-r from-[#002E3E] via-[#005D73] to-[#0091B7] text-white"
        }
      `}
    >
      <div className="flex items-center justify-between px-4 py-2 max-w-full">

        {/* LOGO + IDENTIDAD */}
        <div className="flex items-center gap-2">
          <img
            src={logoEnap}
            alt="ENAP"
            className="w-10 h-auto bg-white rounded-md p-1.5 shadow"
          />
          <div>
            <h1 className="font-semibold text-sm md:text-base tracking-wide">
              ENAP Reservas
            </h1>
            <p className="text-xs text-white/70">
              {userRole === "ADMIN" ? "Panel Administrativo" : "Portal Socios"}
            </p>
          </div>
        </div>

        {/* ACCIÓN EXTRA (solo desktop) */}
        {extraActions && (
          <div className="hidden md:flex">
            {extraActions}
          </div>
        )}

        {/* CONTROLES (tema + usuario + salir) */}
        <div className="flex items-center gap-3">

          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Usuario */}
          <span className="hidden sm:block text-xs md:text-sm font-medium">
            {userName} ({userRole})
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-1.5
              bg-enap-primary text-[#003B4D]
              px-3 py-1.5 rounded-md
              font-semibold text-xs md:text-sm
              hover:bg-enap-accent
            "
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>

          {/* Mobile toggle (solo SOCIO / móvil) */}
          {extraActions && (
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE extraActions */}
      <AnimatePresence>
        {menuOpen && extraActions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="md:hidden bg-[#003B4D] border-t border-white/10 px-4 py-3"
          >
            {extraActions}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
