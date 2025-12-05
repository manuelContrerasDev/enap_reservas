export const PATHS = {
  /* =========================================================================
   * 🔓 PÚBLICAS — Auth
   * ========================================================================= */
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/register",
  AUTH_CONFIRM: "/auth/confirm",
  AUTH_EMAIL_SENT: "/auth/email-sent",
  AUTH_LINK_EXPIRED: "/auth/link-expired",
  AUTH_RESET_CONFIRM: "/auth/reset-confirm",
  AUTH_RESET_REQUEST: "/auth/reset-request",
  AUTH_ALREADY_CONFIRMED: "/auth/already-confirmed",
  AUTH_RESEND_CONFIRMATION: "/auth/resend-confirmation",

  /* =========================================================================
   * 🏠 HOME BASE (NO SE USA COMO PANTALLA)
   * ========================================================================= */
  APP_HOME: "/app/home",

  /* =========================================================================
   * 🏠 HOME POR ROL
   * ========================================================================= */
  SOCIO_HOME: "/app/espacios",
  EXTERNO_HOME: "/app/espacios",
  ADMIN_HOME: "/app/admin/reservas",

  /* =========================================================================
   * 👥 SOCIOS / EXTERNOS → ESPACIOS & RESERVAS
   * ========================================================================= */
  SOCIO_ESPACIOS: "/app/espacios",
  SOCIO_ESPACIO_DETALLE: "/app/espacios/:id",
  SOCIO_MIS_RESERVAS: "/app/mis-reservas",

  /* RESERVAS */
  RESERVA: "/app/reserva",
  RESERVA_ID: "/app/reservar/:id",
  RESERVA_PREVIEW: "/app/reserva/preview",

  /* =========================================================================
   * 💳 PAGOS
   * ========================================================================= */
  PAGO: "/app/pago",
  PAGO_WEBPAY_RETORNO: "/app/pago/webpay/retorno",
  PAGO_WEBPAY_FINAL: "/app/pago/webpay/final",

  /* =========================================================================
   * 🧑‍💼 ADMINISTRACIÓN
   * ========================================================================= */
  ADMIN: "/app/admin/reservas",
  ADMIN_ESPACIOS: "/app/admin/espacios",
  TESORERIA: "/app/admin/tesoreria",

  /* =========================================================================
   * 🧹 DEFAULT
   * ========================================================================= */
  NOT_FOUND: "*",
} as const;
