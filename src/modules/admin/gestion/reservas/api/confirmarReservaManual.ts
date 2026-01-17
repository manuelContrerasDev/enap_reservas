// src/modules/admin/reservas/api/confirmarReservaManual.ts
import { http } from "@/shared/api/http";

interface ConfirmarReservaResponse {
  ok: boolean;
  error?: string;
}

export async function confirmarReservaManual(reservaId: string): Promise<void> {
  const { data } = await http.patch<ConfirmarReservaResponse>(
    `/admin/reservas/${reservaId}/confirmar`
  );

  if (!data.ok) {
    throw new Error(data.error ?? "No se pudo confirmar la reserva");
  }
}
