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

  // 🏠 Bases
  APP_HOME: "/app/home",

  // 👥 Usuario SOCIO / EXTERNO
  SOCIO_HOME: "/app/espacios",
  EXTERNO_HOME: "/app/espacios",
  SOCIO_ESPACIOS: "/app/espacios",
  SOCIO_ESPACIO_DETALLE: "/app/espacios/:id",
  SOCIO_MIS_RESERVAS: "/app/mis-reservas",

  // 📅 Reservas
  RESERVA: "/app/reserva",
  RESERVA_ID: "/app/reservar/:id",
  RESERVA_PREVIEW: "/app/reserva/preview",

  // 💳 Pagos
  RESERVA_PAGO: "/app/pago",
  PAGO_WEBPAY_RETORNO: "/app/pago/webpay/retorno",
  PAGO_WEBPAY_FINAL: "/app/pago/webpay/final",

  // 🧑‍💼 Admin
  ADMIN_HOME: "/app/admin/reservas",
  ADMIN_RESERVAS: "/app/admin/reservas",
  ADMIN_RESERVAS_MANUAL: "/app/admin/reservas/crear-reserva",
  ADMIN_ESPACIOS: "/app/admin/espacios",
  TESORERIA: "/app/admin/tesoreria",

  // 🔚 Default
  NOT_FOUND: "*",
} as const;
