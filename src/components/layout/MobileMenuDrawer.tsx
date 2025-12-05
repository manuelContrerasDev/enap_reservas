import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { ROUTES } from "@/routes/config";
import { useAuth } from "@/context/AuthContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenuDrawer({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  if (!user) return null;

  const visibleRoutes = ROUTES.filter(
    (r) => r.showInNav && (!r.roles || r.roles.includes(user.role))
  );

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* DRAWER */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed top-0 left-0 h-full w-64 bg-[#002E3E] text-white shadow-xl z-50 lg:hidden"
      >
        {/* HEADER */}
        <div className="px-6 pt-8 pb-6 border-b border-white/10 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-wide">
            <span className="text-[#FFD84D]">ENAP</span> Reservas
          </h1>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* NAV */}
        <nav className="px-4 py-6 space-y-1">
          {visibleRoutes.map((route) => {
            const Icon = route.icon!;
            return (
              <NavLink
                key={route.path}
                to={route.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `
                  flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                  ${isActive
                    ? "bg-[#01485E] text-white shadow-inner"
                    : "hover:bg-[#013748] text-white/80 hover:text-white"}
                `
                }
              >
                {Icon && <Icon className="h-5 w-5 opacity-90" />}
                {route.label}
              </NavLink>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="
              w-full py-2 rounded-lg text-sm font-semibold
              bg-[#FFD84D] text-[#003B4D]
              transition-all
              hover:bg-[#FFE28A]
            "
          >
            Cerrar sesión
          </button>
        </div>
      </motion.aside>
    </>
  );
}
