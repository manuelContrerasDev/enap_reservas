// src/modules/reservas/services/cancelarReservaSocio.ts
const API_URL = import.meta.env.VITE_API_URL;

export type CancelarReservaPayload = { motivo?: string };

export async function cancelarReservaSocio(
  token: string,
  reservaId: string,
  payload?: CancelarReservaPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const resp = await fetch(`${API_URL}/api/reservas/${reservaId}/cancelacion`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload ?? {}),
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok || json?.ok === false) {
      return { ok: false, error: json?.error || "Error cancelando reserva" };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Error inesperado" };
  }
}
