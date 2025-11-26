import React, { useState, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, Sun, Moon } from "lucide-react";
import * as Icons from "lucide-react";

import { ROUTES } from "../../routes/config";
import { PATHS } from "../../routes/paths";
import { useAuth } from "../../context/AuthContext";
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
  const { userRole, userName, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  

  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const role = userRole;

  /** Filtrar rutas según permisos */
  const accessibleRoutes = ROUTES.filter(
    (route) => !route.roles || (role && route.roles.includes(role))
  );

  const handleLogout = useCallback(() => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      logout();
      navigate(PATHS.AUTH_LOGIN);
    }
  }, [logout, navigate]);

  const isDark = theme === "dark";

  return (
    <motion.header
      variants={variants.header}
      initial="initial"
      animate="animate"
      className={`shadow-md sticky top-0 z-50 border-b border-[#DEC01F]/40 ${
        isDark
          ? "bg-[#001C26] text-white"
          : "bg-gradient-to-r from-[#002E3E] via-[#003B4D] to-[#00475A] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate(PATHS.ESPACIOS)}
        >
          <img
            src={logoEnap}
            alt="Logo ENAP"
            className="w-12 h-auto bg-white rounded-md p-1.5 shadow-sm"
          />
          <div>
            <h1 className="text-lg font-semibold">ENAP Reservas</h1>
            <p className="text-xs text-[#C7D9DC]">
              {role === "ADMIN"
                ? "Panel Administrativo"
                : "Sistema de Reservas y Pagos"}
            </p>
          </div>
        </div>

        {/* Extra actions (botón INVITAR) */}
        {extraActions && (
          <div className="hidden md:flex items-center mr-4">{extraActions}</div>
        )}

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="md:hidden p-2 rounded-md hover:bg-white/10"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {accessibleRoutes.map(({ path, label, icon }) => {
            const Icon = icon ? (Icons as any)[icon] : null;

            return (
              <NavLink
                key={path}
                to={path.replace(":id", "")}
                onClick={onRouteChange}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md ${
                    isActive
                      ? "bg-[#DEC01F] text-[#002E3E]"
                      : "hover:bg-white/10 text-white"
                  }`
                }
              >
                {Icon && <Icon size={18} />}
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User settings */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <span className="text-sm text-[#F0F0F0]">
            {userName} ({role})
          </span>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#DEC01F] text-[#002E3E] px-3 py-1.5 rounded-md hover:bg-[#E8CF4F]"
          >
            <LogOut size={16} />
            Salir
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            variants={variants.menuMobile}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`md:hidden border-t border-white/10 ${
              isDark ? "bg-[#001C26]" : "bg-[#002E3E]"
            }`}
          >
            <ul className="flex flex-col px-4 py-3 space-y-2">
              
              {extraActions && <li>{extraActions}</li>}

              {accessibleRoutes.map(({ path, label, icon }) => {
                const Icon = icon ? (Icons as any)[icon] : null;

                return (
                  <li key={path}>
                    <NavLink
                      to={path.replace(":id", "")}
                      onClick={() => {
                        setMenuOpen(false);
                        onRouteChange();
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-white/10 text-white"
                    >
                      {Icon && <Icon size={18} />}
                      <span>{label}</span>
                    </NavLink>
                  </li>
                );
              })}

              <li className="border-t border-white/20 pt-2 mt-2 flex justify-between">
                
                <button
                  onClick={toggleTheme}
                  className="flex-1 py-2 text-white hover:bg-white/10 rounded-md"
                >
                  {isDark ? "Modo claro" : "Modo oscuro"}
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 bg-[#DEC01F] text-[#002E3E] rounded-md py-2 ml-2 hover:bg-[#E8CF4F]"
                >
                  Salir
                </button>

              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
