// src/modules/admin/reservas/api/crearReservaManual.ts
import { http } from "@/shared/api/http";
import type {
  ReservaManualBackendPayload,
  ReservaManualResult,
} from "@/modules/admin/gestion/reservas/types/reservaManualBackend";

interface CrearReservaManualResponse {
  ok: boolean;
  data?: ReservaManualResult;
  error?: string;
}

export async function crearReservaManual(
  payload: ReservaManualBackendPayload
): Promise<ReservaManualResult> {
  const { data } = await http.post<CrearReservaManualResponse>(
    "/admin/reservas/crear",
    payload
  );

  if (!data.ok || !data.data) {
    throw new Error(data.error ?? "ERROR_CREAR_RESERVA_MANUAL");
  }

  return data.data;
}
