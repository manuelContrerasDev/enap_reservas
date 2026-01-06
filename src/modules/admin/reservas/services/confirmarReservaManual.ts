// src/modules/admin/reservas/services/confirmarReservaManual.ts
import { api } from "@/lib/axios";

export async function confirmarReservaManual(reservaId: string) {
  await api.patch(`/admin/reservas/${reservaId}/confirmar`);
}
