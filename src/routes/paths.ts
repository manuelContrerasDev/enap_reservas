export const PATHS = {
  // 🔓 PÚBLICAS (login + registro)
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/registro",

  // 🔓 RECUPERACIÓN DE CONTRASEÑA
  AUTH_RESET_REQUEST: "/auth/reset-request",
  AUTH_RESET_CONFIRM: "/auth/reset-password", // viene con token por query

  // 👥 SOCIO / INVITADO / ADMIN
  ESPACIOS: "/espacios",
  RESERVA: "/reserva",
  RESERVA_DETALLE: "/reservar/:id",
  PAGO: "/pago",

  // 💳 PAGOS
  PAGO_WEBPAY_RETORNO: "/pago/webpay/retorno",
  PAGO_WEBPAY_FINAL: "/pago/webpay/final",

  // 🧑‍💼 ADMIN
  ADMIN: "/admin",
  ADMIN_ESPACIOS: "/admin/espacios",
  TESORERIA: "/tesoreria",

  // 🚫 404
  NOT_FOUND: "*",
} as const;
