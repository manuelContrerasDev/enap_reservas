// ============================================================
// useNotificaciones.ts — Hook global de notificaciones ENAP
// ============================================================

import { useCallback } from "react";
import { useNotificacionStore } from "@/store/notificaciones.store";

export function useNotificaciones() {
  const agregar = useNotificacionStore((s) => s.agregar);

  const agregarNotificacion = useCallback(
    (mensaje: string, tipo: "success" | "error" | "warning" | "info" = "info") => {
      agregar({
        id: crypto.randomUUID(),
        mensaje,
        tipo,
        fecha: new Date(),
      });
    },
    [agregar]
  );

  return { agregarNotificacion };
}
