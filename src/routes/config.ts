// src/routes/config.ts
import { PATHS } from "./paths";
import {
  MapPinned,
  CalendarDays,
  CalendarPlus,
  ClipboardCheck,
  Eye,
  CreditCard,
  RefreshCcw,
  CheckCircle,
  Calendar,
  Building2,
  DollarSign
} from "lucide-react";

export type AppRole = "ADMIN" | "SOCIO" | "EXTERNO";

export interface AppRoute {
  path: string;
  label: string;
  icon?: React.ComponentType<any>; // ← FIX DEFINITIVO
  roles?: AppRole[];
  showInNav?: boolean;
  section?: "SOCIO" | "ADMIN";
}

export const ROUTES: AppRoute[] = [
  /* SOCIO */
  {
    path: PATHS.SOCIO_ESPACIOS,
    label: "Espacios",
    icon: MapPinned,
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: true,
    section: "SOCIO",
  },
  {
    path: PATHS.SOCIO_MIS_RESERVAS,
    label: "Mis Reservas",
    icon: CalendarDays,
    roles: ["SOCIO"],
    showInNav: true,
    section: "SOCIO",
  },

  /* RESERVAS */
  {
    path: PATHS.RESERVA,
    label: "Reservar",
    icon: CalendarPlus,
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: false,
  },
  {
    path: PATHS.RESERVA_ID,
    label: "Reserva Detalle",
    icon: ClipboardCheck,
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: false,
  },
  {
    path: PATHS.RESERVA_PREVIEW,
    label: "Vista Previa",
    icon: Eye,
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: false,
  },

  /* PAGOS */
  {
    path: PATHS.PAGO,
    label: "Pago",
    icon: CreditCard,
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: false,
  },
  {
    path: PATHS.PAGO_WEBPAY_RETORNO,
    label: "Webpay Retorno",
    icon: RefreshCcw,
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: false,
  },
  {
    path: PATHS.PAGO_WEBPAY_FINAL,
    label: "Webpay Final",
    icon: CheckCircle,
    roles: ["SOCIO", "EXTERNO", "ADMIN"],
    showInNav: false,
  },

  /* ADMIN */
  {
    path: PATHS.ADMIN,
    label: "Reservas",
    icon: Calendar,
    roles: ["ADMIN"],
    showInNav: true,
    section: "ADMIN",
  },
  {
    path: PATHS.ADMIN_ESPACIOS,
    label: "Gestión de Espacios",
    icon: Building2,
    roles: ["ADMIN"],
    showInNav: true,
    section: "ADMIN",
  },
  {
    path: PATHS.TESORERIA,
    label: "Tesorería",
    icon: DollarSign,
    roles: ["ADMIN"],
    showInNav: true,
    section: "ADMIN",
  },
];
