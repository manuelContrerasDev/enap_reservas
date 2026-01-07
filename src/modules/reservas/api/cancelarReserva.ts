import { http } from "@/shared/api/http";

export type CancelarReservaPayload = {
  motivo?: string;
};

export async function cancelarReserva(
  reservaId: string,
  payload?: CancelarReservaPayload
): Promise<void> {
  await http(`/api/reservas/${reservaId}/cancelacion`, {
    method: "PATCH",
    body: JSON.stringify(payload ?? {}),
  });
}
