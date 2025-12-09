// src/modules/pagos/services/confirmPago.ts
import { api } from "@/lib/axios";

export type PagoStatus = "APPROVED" | "REJECTED" | "CANCELLED";

export interface ConfirmPagoResponse {
  status: PagoStatus;
  pagoId: string;
  reservaId: string;
  responseCode: number | null;
  message: string | null;
}

export async function confirmPago(tokenWs: string): Promise<ConfirmPagoResponse> {
  const resp = await api.post<ConfirmPagoResponse>("/pago/confirm", {
    tokenWs,
  });

  return resp.data; // resp.data es 100% ConfirmPagoResponse
}
