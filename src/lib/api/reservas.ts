// src/lib/api/reservas.ts

import { api } from "../axios";

export async function actualizarInvitados(reservaId: string, invitados: any[]) {
  const { data } = await api.patch(`/reservas/${reservaId}/invitados`, {
    invitados,
  });
  return data;
}
