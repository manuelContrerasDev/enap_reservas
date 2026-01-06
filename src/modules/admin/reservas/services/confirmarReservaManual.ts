// src/modules/admin/reservas/services/confirmarReservaManual.ts
import { api } from "@/lib/api";

export async function confirmarReservaManual(reservaId: string) {
  await api.patch(`/admin/reservas/${reservaId}/confirmar`);
}
