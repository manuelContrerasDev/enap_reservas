// src/modules/admin/reservas/services/subirComprobanteAdmin.ts
import { api } from "@/lib/api";

type Payload = {
  comprobanteUrl: string;
  comprobanteName: string;
  comprobanteMime: string;
  comprobanteSize: number;
};

export async function subirComprobanteAdmin(
  reservaId: string,
  payload: Payload
) {
  await api.patch(`/admin/reservas/${reservaId}/comprobante`, payload);
}
