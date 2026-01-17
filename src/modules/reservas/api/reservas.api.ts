// src/lib/api/reservas.ts

import { http } from "@/shared/api/http";

export async function actualizarInvitados(reservaId: string, invitados: any[]) {
  const { data } = await http.patch(`/reservas/${reservaId}/invitados`, {
    invitados,
  });
  return data;
}
