import { PATHS } from "./paths";

export type AppRole = "ADMIN" | "SOCIO" | "EXTERNO";

export interface AppRoute {
  path: string;
  label: string;
  icon?: string;
  roles?: AppRole[];
  showInNav?: boolean;
}

export const ROUTES: AppRoute[] = [
  {
    path: PATHS.ESPACIOS,
    label: "Espacios",
    icon: "MapPinned",
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: true,
  },

  {
    path: PATHS.RESERVA,
    label: "Reservar",
    icon: "Calendar",
    roles: ["SOCIO", "EXTERNO"],
    showInNav: false,
  },

  {
    path: PATHS.PAGO,
    label: "Pago",
    icon: "CreditCard",
    roles: ["SOCIO", "EXTERNO"],
    showInNav: false,
  },

  {
    path: PATHS.ADMIN,
    label: "Reservas (Admin)",
    icon: "Calendar",
    roles: ["ADMIN"],
    showInNav: true,
  },
  {
    path: PATHS.ADMIN_ESPACIOS,
    label: "Gestión de Espacios",
    icon: "Building2",
    roles: ["ADMIN"],
    showInNav: true,
  },
  {
    path: PATHS.TESORERIA,
    label: "Tesorería",
    icon: "DollarSign",
    roles: ["ADMIN"],
    showInNav: true,
  },
  
];
