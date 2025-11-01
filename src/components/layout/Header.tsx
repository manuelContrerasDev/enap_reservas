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
}

const Header: React.FC<HeaderProps> = ({ variants, onRouteChange }) => {
  const { userRole, userName, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const accessibleRoutes = ROUTES.filter(
    (route) => !route.roles || route.roles.includes(userRole!)
  );

  const handleLogout = useCallback(() => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
      logout();
      navigate(PATHS.LOGIN);
    }
  }, [logout, navigate]);

  const isDark = theme === "dark";

  return (
    <motion.header
      variants={variants.header}
      initial="initial"
      animate="animate"
      role="banner"
      className={`shadow-md sticky top-0 z-50 border-b border-[#DEC01F]/40 transition-colors duration-300 ${
        isDark
          ? "bg-[#001C26] text-white"
          : "bg-gradient-to-r from-[#002E3E] via-[#003B4D] to-[#00475A] text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        {/* 🏢 Logo + Marca */}
        <div className="flex items-center space-x-3 select-none">
          <img
            src={logoEnap}
            alt="Logo ENAP"
            className="w-12 h-auto bg-white rounded-md p-1.5 shadow-sm"
            loading="lazy"
          />
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-white">
              ENAP Reservas
            </h1>
            <p className="text-xs text-[#C7D9DC]">
              {userRole === "admin"
                ? "Panel Administrativo"
                : "Sistema de Reservas y Pagos"}
            </p>
          </div>
        </div>

        {/* 📱 Toggle menú móvil */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Alternar menú"
          className="md:hidden p-2 rounded-md hover:bg-white/10 transition"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* 🧭 Navegación Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {accessibleRoutes.map(({ path, label, icon }) => {
            const Icon = icon ? (Icons as any)[icon] : null;
            return (
              <NavLink
                key={path}
                to={path.replace(":id", "")}
                onClick={onRouteChange}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                    isActive
                      ? "bg-[#DEC01F] text-[#002E3E]"
                      : "hover:bg-white/10 text-white"
                  }`
                }
              >
                {Icon && <Icon size={18} aria-hidden="true" />}
                <span className="font-medium">{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* 🌗 Toggle tema + Usuario */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Botón modo claro/oscuro */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Alternar modo de color"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <span className="text-sm font-medium capitalize text-[#F0F0F0]">
            {userName || "Usuario"} ({userRole})
          </span>
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-2 bg-[#DEC01F] hover:bg-[#E8CF4F] text-[#002E3E] px-3 py-1.5 rounded-md font-semibold text-sm shadow-sm transition-all focus:ring-2 focus:ring-[#DEC01F]/60"
          >
            <LogOut size={16} aria-hidden="true" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* 📱 Menú móvil */}
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
            role="navigation"
          >
            <ul className="flex flex-col px-4 py-3 space-y-2">
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
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                          isActive
                            ? "bg-[#DEC01F] text-[#002E3E]"
                            : "hover:bg-white/10 text-white"
                        }`
                      }
                    >
                      {Icon && <Icon size={18} aria-hidden="true" />}
                      <span>{label}</span>
                    </NavLink>
                  </li>
                );
              })}

              <li className="border-t border-white/20 pt-2 mt-2 flex justify-between items-center">
                <button
                  onClick={toggleTheme}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-white hover:bg-white/10 rounded-md transition-all"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? "Modo claro" : "Modo oscuro"}
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#DEC01F] text-[#002E3E] font-semibold hover:bg-[#E8CF4F] rounded-md py-2 transition-all"
                >
                  <LogOut size={18} />
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
