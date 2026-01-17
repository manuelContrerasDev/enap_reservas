// src/components/layout/Sidebar/index.tsx
import React from "react";
import { useAuth } from "@/modules/auth/hooks";
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
} from "lucide-react";

import type { UserRole } from "@/modules/auth/types/auth.types";

// ============================================================
// MENÚ POR ROLES — ENAP 2025
// ============================================================

type MenuItem = {
  label: string;
  path: string;
  icon: React.ElementType;
};

const MENU: Record<UserRole, MenuItem[]> = {
  SOCIO: [
    { label: "Espacios", path: PATHS.SOCIO_ESPACIOS, icon: MapPinned },
    { label: "Mis Reservas", path: PATHS.SOCIO_MIS_RESERVAS, icon: CalendarDays },
  ],

  EXTERNO: [
    { label: "Espacios", path: PATHS.SOCIO_ESPACIOS, icon: MapPinned },
    { label: "Mis Reservas", path: PATHS.SOCIO_MIS_RESERVAS, icon: CalendarDays },
  ],

  ADMIN: [
    { label: "Gestión de Reservas", path: PATHS.ADMIN_RESERVAS, icon: Calendar },
    { label: "Gestión de Espacios", path: PATHS.ADMIN_ESPACIOS, icon: Building2 },
    { label: "Tesorería", path: PATHS.TESORERIA, icon: DollarSign },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const items = MENU[user.role] ?? [];

  return (
    <aside className="h-full w-64 bg-[#002E3E] text-white flex flex-col shadow-xl border-r border-[#003B4D]/30">
      <SidebarHeader user={user} />

      <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
        {items.length === 0 ? (
          <p className="px-3 text-sm text-white/60">
            No hay opciones disponibles para tu rol.
          </p>
        ) : (
          <SidebarSection items={items} />
        )}
      </nav>

      <SidebarFooter onLogout={logout} />
    </aside>
  );
}
