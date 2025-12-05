import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/config";

export default function SidebarDesktop() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const visibleRoutes = ROUTES.filter(
    (r) => r.showInNav && (!r.roles || r.roles.includes(user.role))
  );

  return (
    <aside
      className="
        hidden lg:flex
        h-screen w-64 bg-[#002E3E] text-white flex-col
        shadow-xl border-r border-[#003B4D]/40
      "
    >
      {/* HEADER */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <h1 className="text-xl font-semibold tracking-wide">
          <span className="text-[#FFD84D]">ENAP</span> Reservas
        </h1>
        <p className="text-sm text-white/60 mt-1">
          {user?.name ?? "Usuario"}
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {visibleRoutes.map((route) => {
          const Icon = route.icon!;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `
                  group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
                  transition-colors
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
          onClick={logout}
          className="
            w-full py-2 rounded-lg text-sm font-semibold
            bg-[#FFD84D] text-[#003B4D]
            transition-all duration-200
            hover:bg-[#FFE28A] hover:shadow-md
            active:scale-[0.98]
          "
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
