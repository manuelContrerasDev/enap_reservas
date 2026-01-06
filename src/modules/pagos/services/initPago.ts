// src/modules/pagos/services/initPago.ts
import { api } from "@/lib/axios";

export interface InitPagoResponse {
  ok: true;
  pagoId: string;
  checkoutUrl: string;
}

export async function initPago(reservaId: string): Promise<InitPagoResponse> {
  const resp = await api.post<InitPagoResponse>(
    "/api/pagos/checkout",
    { reservaId }
  );

  const data = resp.data;

  if (!data || !data.ok || !data.checkoutUrl) {
    throw new Error("No se pudo iniciar el pago.");
  }

  return data;
}
