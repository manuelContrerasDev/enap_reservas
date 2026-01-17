// src/modules/auth/pages/index.ts
/**
 * AUTH PAGES EXPORTS
 * ============================================================
 * Punto único de exportación de las páginas del módulo AUTH.
 *
 * Usado por:
 * - Router principal
 * - Lazy loading
 * - Guards / redirects
 *
 * Convenciones:
 * - Pages = vistas completas (UX)
 * - redirects = estados derivados de enlaces (email, tokens)
 *
 * ⚠️ IMPORTANTE
 * - Estas páginas NO contienen lógica de negocio
 * - Toda comunicación con backend pasa por authApi
 * - Toda sesión se gestiona vía AuthContext
 */

/* ============================================================
 * CORE AUTH PAGES
 * ============================================================ */
export { default as LoginPage } from "./LoginPage";
export { default as RegisterPage } from "./RegisterPage";
export { default as ResetRequestPage } from "./ResetRequestPage";

/* ============================================================
 * REDIRECT / STATE PAGES
 * ============================================================ */
export { default as ConfirmEmailPage } from "./redirects/ConfirmEmailPage";
export { default as ResetConfirmPage } from "./redirects/ResetConfirmPage";
export { default as EmailSentPage } from "./redirects/EmailSentPage";
export { default as AlreadyConfirmedPage } from "./redirects/AlreadyConfirmedPage";
export { default as ResendConfirmPage } from "./redirects/ResendConfirmPage";
export { default as LinkExpiredPage } from "./redirects/LinkExpiredPage";
