// src/modules/pagos/services/initPago.ts
import { http } from "@/shared/api/http";

export interface InitPagoResponse {
  ok: boolean;
  pagoId?: string;
  checkoutUrl?: string;
  error?: string;
}

export async function initPago(reservaId: string): Promise<InitPagoResponse> {
  const resp = await http.post<InitPagoResponse>(
    "/api/pagos/checkout",
    { reservaId }
  );

  const data = resp.data;

  if (!data || !data.ok || !data.checkoutUrl) {
    throw new Error("No se pudo iniciar el pago.");
  }

  return data;
}
