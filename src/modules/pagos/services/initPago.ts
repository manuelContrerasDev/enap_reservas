// src/modules/pagos/services/initPago.ts
import { api } from "@/lib/axios";

export interface InitPagoResponse {
  ok: true;
  pagoId: string;
  checkoutUrl: string;
  token: string;
}

export async function initPago(reservaId: string): Promise<InitPagoResponse> {
  const resp = await api.post<InitPagoResponse>("/pago/init", { reservaId });

  const data = resp.data;

  if (!data || !data.ok) {
    throw new Error("No se pudo iniciar el pago.");
  }

  return data;
}
