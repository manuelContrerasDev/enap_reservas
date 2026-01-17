// src/modules/auth/helpers/auth.error-mapper.ts

import { AuthErrorCode } from "../types/auth.errors";

/**
 * Traduce códigos de error backend → mensaje UX
 * ⚠️ NO maneja lógica, solo presentación
 */
export function mapAuthError(code?: AuthErrorCode): string {
  switch (code) {
    case AuthErrorCode.EMAIL_ALREADY_REGISTERED:
      return "Este correo ya está registrado.";

    case AuthErrorCode.EMAIL_NOT_CONFIRMED:
      return "Debes confirmar tu correo antes de iniciar sesión.";

    case AuthErrorCode.EMAIL_ALREADY_CONFIRMED:
      return "Este correo ya fue confirmado previamente.";

    case AuthErrorCode.INVALID_CREDENTIALS:
      return "Correo o contraseña incorrectos.";

    case AuthErrorCode.INVALID_OR_EXPIRED_TOKEN:
      return "El enlace ya no es válido o ha expirado.";

    case AuthErrorCode.CONNECTION_ERROR:
      return "No se pudo conectar con el servidor.";

    default:
      return "Ocurrió un error inesperado. Inténtalo nuevamente.";
  }
}
