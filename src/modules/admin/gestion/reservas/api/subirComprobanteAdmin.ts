// src/modules/admin/reservas/api/subirComprobanteAdmin.ts
import { http } from "@/shared/api/http";

type Payload = {
  comprobanteUrl: string;
  comprobanteName: string;
  comprobanteMime: string;
  comprobanteSize: number;
};

interface SubirComprobanteResponse {
  ok: boolean;
  error?: string;
}

export async function subirComprobanteAdmin(
  reservaId: string,
  payload: Payload
): Promise<void> {
  const { data } = await http.patch<SubirComprobanteResponse>(
    `/admin/reservas/${reservaId}/comprobante`,
    payload
  );

  if (!data.ok) {
    throw new Error(data.error ?? "No se pudo subir el comprobante");
  }
}
