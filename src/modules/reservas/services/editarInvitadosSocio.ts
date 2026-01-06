// src/modules/reservas/services/editarInvitadosSocio.ts
import type { InvitadoDTO } from "@/types/ReservaDTO";

const API_URL = import.meta.env.VITE_API_URL;

export type EditarInvitadosPayload = {
  invitados: Array<{
    nombre: string;
    rut: string;
    edad?: number | null;
    esPiscina?: boolean;
  }>;
};

export async function editarInvitadosSocio(
  token: string,
  reservaId: string,
  payload: EditarInvitadosPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const resp = await fetch(`${API_URL}/api/reservas/${reservaId}/invitados`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok || json?.ok === false) {
      return { ok: false, error: json?.error || "Error actualizando invitados" };
    }

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || "Error inesperado" };
  }
}
