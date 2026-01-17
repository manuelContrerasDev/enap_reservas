// src/modules/reservas/storage/autoSaveReserva.ts
import type { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";
import type { UseFormWatch } from "react-hook-form";

export const FORM_KEY_RESERVA = "reservaDraftEnap";

export function setupAutoSaveReservaForm(
  watch: UseFormWatch<ReservaFrontendType>,
  storageKey: string = FORM_KEY_RESERVA
) {
  const subscription = watch((value) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {
      // Si falla localStorage, simplemente no rompemos el flujo
      console.error("[AutoSaveReserva] Error guardando en localStorage", e);
    }
  });

  return () => {
    subscription.unsubscribe();
  };
}
