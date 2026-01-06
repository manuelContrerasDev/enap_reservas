// src/components/ui/feedback/index.ts
export { default as Spinner } from "./Spinner";
export { default as Toast } from "./Toast";


/** 
 * 
 * REGLA DE ORO

🔔 Toda notificación del sistema → useNotificacion() → Toast

Ejemplos:
Reserva creada
Error Webpay
Validación backend
Guardado exitoso
Error de permisos

❌ NO alerts inline
❌ NO snackbar local
❌ NO alert() del navegador

 * 
*/