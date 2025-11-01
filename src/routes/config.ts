// src/routes/config.ts
import { PATHS } from "./paths";

export type AppRole = "socio" | "admin";

export interface AppRoute {
  path: string;
  label: string;
  icon?: string;                 // Debe existir en lucide-react
  roles?: AppRole[];             // A qué roles aplica
  showInNav?: boolean;           // ⬅️ si false, no aparece en el menú
}

/**
 * Menú principal dinámico según rol
 */
export const ROUTES: AppRoute[] = [
  // 👥 Vista socio (solo mostramos "Espacios" en el menú)
  {
    path: PATHS.ESPACIOS,        // /espacios
    label: "Espacios",
    icon: "MapPinned",
    roles: ["socio", "admin"],   // también visible para admin si quieres acceder rápido
    showInNav: true,
  },
  {
    path: PATHS.RESERVA,         // /reserva/:id (o similar)
    label: "Reservar",
    icon: "Calendar",
    roles: ["socio"],
    showInNav: false,            // ⬅️ se navega desde Espacios (no directo)
  },
  {
    path: PATHS.PAGO,            // /pago
    label: "Pago",
    icon: "CreditCard",
    roles: ["socio"],
    showInNav: false,            // ⬅️ llega desde Reserva (no directo)
  },

  // 🧑‍💼 Vista admin
  {
    path: PATHS.ADMIN,           // /admin
    label: "Reservas (Admin)",
    icon: "Calendar",
    roles: ["admin"],
    showInNav: true,
  },
  {
    path: PATHS.ADMIN_ESPACIOS,  // /admin/espacios
    label: "Gestión de Espacios",
    icon: "Building2",
    roles: ["admin"],
    showInNav: true,
  },
  {
    path: PATHS.TESORERIA,       // /tesoreria
    label: "Tesorería",
    icon: "DollarSign",
    roles: ["admin"],
    showInNav: true,
  },
];
