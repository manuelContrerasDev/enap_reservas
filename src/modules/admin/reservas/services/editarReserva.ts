import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/ApiResponse";
import type { ReservaDTO } from "@/types/ReservaDTO";

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

export async function editarReserva(
  reservaId: string,
  payload: EditarReservaPayload
): Promise<ReservaDTO> {
  const resp = await api.patch<ApiResponse<ReservaDTO>>(
    `/reservas/${reservaId}`,
    payload
  );

  if (!resp.data.ok) {
    throw new Error(resp.data.error ?? "No se pudo editar la reserva");
  }

  if (!resp.data.data) {
    throw new Error("Respuesta inválida del servidor");
  }

  return resp.data.data;
}
