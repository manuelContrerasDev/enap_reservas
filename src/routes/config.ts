// src/routes/paths.ts
export const PATHS = {
  // 🔓 Auth
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_CONFIRM: "/auth/confirm",
  AUTH_EMAIL_SENT: "/auth/email-sent",
  AUTH_LINK_EXPIRED: "/auth/link-expired",
  AUTH_RESET_CONFIRM: "/auth/reset-confirm",
  AUTH_RESET_REQUEST: "/auth/reset-request",
  AUTH_ALREADY_CONFIRMED: "/auth/already-confirmed",
  AUTH_RESEND_CONFIRMATION: "/auth/resend-confirmation",

  // 🏠 Home por rol
  SOCIO_HOME: "/espacios",
  EXTERNO_HOME: "/espacios",
  ADMIN_HOME: "/admin/reservas",

  // 👥 Socio / Externo
  SOCIO_ESPACIOS: "/espacios",
  SOCIO_ESPACIO_DETALLE: "/espacios/:id",
  SOCIO_MIS_RESERVAS: "/mis-reservas",

  // 📅 Reservas
  RESERVA_ID: "/reservar/:id",
  RESERVA_PREVIEW: "/reserva/preview",
  RESERVA_TRANSFERENCIA: "/reserva/transferencia",

  // 🧑‍💼 Admin
  ADMIN_RESERVAS: "/admin/reservas",
  ADMIN_RESERVAS_MANUAL: "/admin/reservas/crear",
  ADMIN_ESPACIOS: "/admin/espacios",
  TESORERIA: "/admin/tesoreria",

  // 🔚 Default
  NOT_FOUND: "*",
} as const;
