import { http } from "@/shared/api/http";

export type InvitadoPayload = {
  nombre: string;
  rut: string;
  edad?: number | null;
  esPiscina?: boolean;
};

export type ActualizarInvitadosPayload = {
  invitados: InvitadoPayload[];
};

export async function actualizarInvitadosReserva(
  reservaId: string,
  payload: ActualizarInvitadosPayload
): Promise<void> {
  await http(`/api/reservas/${reservaId}/invitados`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
