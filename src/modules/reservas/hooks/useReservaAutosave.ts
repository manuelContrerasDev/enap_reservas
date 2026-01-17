// ============================================================
// useReservaAutosave.ts — Autosave formulario
// ============================================================

import { useEffect } from "react";
import {
  setupAutoSaveReservaForm,
  FORM_KEY_RESERVA,
} from "@/modules/reservas/storage/autoSaveReserva";

export function useReservaAutosave(watch: any) {
  useEffect(() => {
    const cleanup = setupAutoSaveReservaForm(watch, FORM_KEY_RESERVA);
    return cleanup;
  }, [watch]);
}
