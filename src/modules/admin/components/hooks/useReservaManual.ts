import { useCallback, useState } from "react";
import { useAuth } from "@/modules/auth/hooks";
import type { z } from "zod";
import { reservaManualFormSchema } from "@/modules/admin/gestion/reservas/types/reservaManual.schema";

type Payload = z.output<typeof reservaManualFormSchema>;

const API_URL = import.meta.env.VITE_API_URL;

export function useReservaManual() {
  const { token } = useAuth();

  const [reserva, setReserva] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setReserva(null);
    setError(null);
    setLoading(false);
  }, []);

  const crear = useCallback(
    async (payload: Payload) => {
      if (!token) {
        setError("NO_AUTH");
        return { ok: false };
      }

      try {
        setLoading(true);
        setError(null);

        const resp = await fetch(`${API_URL}/api/admin/reservas/crear`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const json = await resp.json();

        if (!resp.ok || json.ok === false) {
          throw new Error(json.error || "ERROR_CREAR_RESERVA_MANUAL");
        }

        setReserva(json.data);
        return { ok: true, data: json.data };
      } catch (e: any) {
        setError(e?.message ?? "ERROR_INESPERADO");
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { crear, reserva, loading, error, reset };
}
