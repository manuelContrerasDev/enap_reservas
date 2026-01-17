// src/modules/admin/modules/reservas/api/editarReserva.ts
import { http } from "@/shared/api/http";
import type { ReservaDTO } from "@/modules/reservas/types/ReservaDTO";

export interface EditarReservaPayload {
  nombreSocio?: string;
  telefonoSocio?: string;
  correoPersonal?: string | null;
  usoReserva?: "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";
  socioPresente?: boolean;
  nombreResponsable?: string | null;
  rutResponsable?: string | null;
  emailResponsable?: string | null;
  telefonoResponsable?: string | null;
}

interface EditarReservaResponse {
  ok: boolean;
  data?: ReservaDTO;
  error?: string;
}

export async function editarReserva(
  reservaId: string,
  payload: EditarReservaPayload
): Promise<ReservaDTO> {
  const { data } = await http.patch<EditarReservaResponse>(
    `/reservas/${reservaId}`,
    payload
  );

  if (!data.ok) {
    throw new Error(data.error ?? "No se pudo editar la reserva");
  }

  if (!data.data) {
    throw new Error("Respuesta inválida del servidor");
  }

  return data.data;
}
