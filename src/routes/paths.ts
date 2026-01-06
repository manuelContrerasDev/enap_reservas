// src/routes/paths.ts

export const PATHS = {
  /* =========================================================================
   * 🔓 AUTENTICACIÓN
  ========================================================================= */
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/registro",
  AUTH_CONFIRM: "/auth/confirmar",
  AUTH_EMAIL_SENT: "/auth/email-enviado",
  AUTH_LINK_EXPIRED: "/auth/enlace-expirado",
  AUTH_RESET_REQUEST: "/auth/recuperar",
  AUTH_RESET_CONFIRM: "/auth/restablecer",
  AUTH_ALREADY_CONFIRMED: "/auth/ya-confirmado",
  AUTH_RESEND_CONFIRMATION: "/auth/reenviar-confirmacion",

  /* =========================================================================
   * 🏠 HOME POR ROL
  ========================================================================= */
  SOCIO_HOME: "/espacios",
  EXTERNO_HOME: "/espacios",
  ADMIN_HOME: "/admin/reservas",

  /* =========================================================================
   * 👥 SOCIOS / EXTERNOS
  ========================================================================= */
  SOCIO_ESPACIOS: "/espacios",
  SOCIO_ESPACIO_DETALLE: "/espacios/:id",
  SOCIO_MIS_RESERVAS: "/mis-reservas",

  /* =========================================================================
   * 📅 RESERVAS
  ========================================================================= */
  RESERVA_ID: "/reservar/:id",
  RESERVA_PREVIEW: "/reserva/resumen",

  /* =========================================================================
   * 🧾 TRANSFERENCIA (PAGO MANUAL)
  ========================================================================= */
  RESERVA_TRANSFERENCIA: "/reserva/transferencia",

  /* =========================================================================
   * 💳 PAGOS (FUTURO — CONGELADO)
  ========================================================================= */
  RESERVA_PAGO: "/pago",
  PAGO_WEBPAY_RETORNO: "/pago/webpay/retorno",
  PAGO_WEBPAY_FINAL: "/pago/webpay/final",

  /* =========================================================================
   * 🧑‍💼 ADMINISTRACIÓN
  ========================================================================= */
  ADMIN_ESPACIOS: "/admin/espacios",
  ADMIN_RESERVAS: "/admin/reservas",
  ADMIN_RESERVAS_MANUAL: "/admin/reservas/crear",
  TESORERIA: "/admin/tesoreria",

  /* =========================================================================
   * 🧹 DEFAULT
  ========================================================================= */
  NOT_FOUND: "*",
} as const;
