// src/utils/notify.ts
import { useNotificacion } from "@/context/NotificacionContext";

// 👇 Esto funciona porque exportamos simples funciones.
// El hook se accede indirectamente vía un puente interno.
let push: ((msg: string, type: "success" | "error" | "info") => void) | null =
  null;

export const notify = {
  register(fn: typeof push) {
    push = fn; // callback que viene del provider
  },

  success(msg: string) {
    push?.(msg, "success");
  },

  error(msg: string) {
    push?.(msg, "error");
  },

  info(msg: string) {
    push?.(msg, "info");
  },
};
