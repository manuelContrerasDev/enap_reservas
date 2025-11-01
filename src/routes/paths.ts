// src/routes/paths.ts

/**
 * 🌐 Definición centralizada de rutas del sistema ENAP Limache.
 * ------------------------------------------------------------
 * Permite mantener consistencia entre componentes, navegación y roles.
 * Contiene tanto rutas públicas como privadas (socio/admin).
 */

export const PATHS = {
  // 🔓 PÚBLICAS
  LOGIN: "/login",
  LOGIN_SOCIO: "/login-socio",
  LOGIN_ADMIN: "/login-admin",
  OVERVIEW: "/overview",

  // 👥 SOCIO
  ESPACIOS: "/espacios",              // Listado de espacios disponibles
  RESERVA: "/reserva",                // Formulario genérico de reserva
  RESERVA_DETALLE: "/reservar/:id",   // Ruta dinámica con ID del espacio
  PAGO: "/pago",                      // Página de pagos y confirmación

  // 🧑‍💼 ADMIN
  ADMIN: "/admin",                    // Panel general administrativo
  ADMIN_ESPACIOS: "/admin/espacios",  // Gestión de espacios
  TESORERIA: "/tesoreria",            // Módulo financiero / control pagos

  // 🚫 ERRORES
  NOT_FOUND: "*",                     // Fallback 404
} as const;

/**
 * 🧭 Ejemplo de uso:
 *
 * import { PATHS } from "@/routes/paths";
 * navigate(PATHS.RESERVA_DETALLE.replace(":id", espacio.id));
 *
 * o bien:
 * navigate(PATHS.RESERVA);
 */
