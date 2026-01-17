export const PATHS = {
  AUTH_LOGIN: "/auth/login",
  AUTH_REGISTER: "/auth/registro",
  AUTH_CONFIRM: "/auth/confirmar",
  AUTH_EMAIL_SENT: "/auth/email-enviado",
  AUTH_LINK_EXPIRED: "/auth/enlace-expirado",
  AUTH_RESET_REQUEST: "/auth/recuperar",
  AUTH_RESET_CONFIRM: "/auth/restablecer",
  AUTH_ALREADY_CONFIRMED: "/auth/ya-confirmado",
  AUTH_RESEND_CONFIRMATION: "/auth/reenviar-confirmacion",

  SOCIO_HOME: "/espacios",
  ADMIN_HOME: "/admin/reservas",

  SOCIO_ESPACIOS: "/espacios",
  SOCIO_MIS_RESERVAS: "/mis-reservas",

  RESERVA_ID: "/reservar/:id",
  RESERVA_PREVIEW: "/reserva/preview",
  RESERVA_TRANSFERENCIA: "/reserva/transferencia",


  //ADMIN
  ADMIN_ESPACIOS: "/admin/espacios",
  ADMIN_RESERVAS: "/admin/reservas",
  ADMIN_RESERVAS_MANUAL: "/admin/reservas/crear",
  TESORERIA: "/admin/tesoreria",

  ADMIN_AUDIT: "/admin/audit",

  NOT_FOUND: "*",
} as const;
