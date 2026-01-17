// src/modules/pagos/api/initPago.api.ts
import { http } from "@/shared/api/http";
import type { InitPagoResponse } from "../types";

export async function initPago(
  reservaId: string
): Promise<InitPagoResponse> {
  const { data } = await http.post<InitPagoResponse>("/pagos/checkout", {
    reservaId,
  });

  if (!data.ok) {
    throw new Error(data.error ?? "No se pudo iniciar el pago");
  }

  return data;
}
