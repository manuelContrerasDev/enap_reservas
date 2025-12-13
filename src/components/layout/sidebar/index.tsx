// src/components/layout/Sidebar/index.tsx
import React from "react";
import { useAuth } from "@/context/auth";
import { PATHS } from "@/routes/paths";

import SidebarHeader from "./SidebarHeader";
import SidebarSection from "./SidebarSection";
import SidebarFooter from "./SidebarFooter";

import {
  MapPinned,
  CalendarDays,
  Calendar,
  Building2,
  DollarSign,
  User,
} from "lucide-react";

// ============================================================
// MENÚ POR ROLES — ENAP 2025
// ============================================================
const MENU = {
  SOCIO: [
    { label: "Espacios", path: PATHS.SOCIO_ESPACIOS, icon: MapPinned },
    { label: "Mis Reservas", path: PATHS.SOCIO_MIS_RESERVAS, icon: CalendarDays },
    { label: "Mi Perfil", path: PATHS.APP_HOME, icon: User },
  ],

  ADMIN: [
    { label: "Gestión de Reservas", path: PATHS.ADMIN_RESERVAS, icon: Calendar },
    { label: "Gestión de Espacios", path: PATHS.ADMIN_ESPACIOS, icon: Building2 },
    { label: "Tesorería", path: PATHS.TESORERIA, icon: DollarSign },
    { label: "Mi Perfil", path: PATHS.APP_HOME, icon: User },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const items = MENU[user.role as keyof typeof MENU] ?? [];

  return (
    <aside
      className="
        h-full w-64 bg-[#002E3E] text-white flex flex-col
        shadow-xl border-r border-[#003B4D]/30
      "
    >
      <SidebarHeader user={user} />

      <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        <SidebarSection items={items} />
      </nav>

      <SidebarFooter onLogout={logout} />
    </aside>
  );
}
