// src/modules/reservas/hooks/useReservasSocio.ts
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/auth";
import { normalizarReserva } from "@/utils/normalizarReserva";
import type { ReservaFrontend } from "@/types/ReservaFrontend";
import type { ReservaDTO } from "@/types/ReservaDTO";

const API_URL = import.meta.env.VITE_API_URL;

export function useReservasSocio() {
  const { token } = useAuth();

  const [reservas, setReservas] = useState<ReservaFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      // ✅ tu backend tiene /api/reservas/mis-reservas
      const resp = await fetch(`${API_URL}/api/reservas/mis-reservas`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await resp.json();

      // ✅ contrato típico: { ok: true, data: [...] } o { ok: true, reservas: [...] }
      const list: ReservaDTO[] = (json?.data ?? json?.reservas ?? []) as ReservaDTO[];

      if (!resp.ok || json?.ok === false) {
        console.error("Error cargando reservas:", json);
        setReservas([]);
        return;
      }

      setReservas(list.map(normalizarReserva));
    } catch (err) {
      console.error("Error:", err);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { reservas, loading, reload: cargar };
}
