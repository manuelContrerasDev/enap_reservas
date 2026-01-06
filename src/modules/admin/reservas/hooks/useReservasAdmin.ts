import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/auth";

import { normalizarReserva } from "@/utils/normalizarReserva";
import type { ReservaDTO } from "@/types/ReservaDTO";
import type { ReservaFrontend } from "@/types/ReservaFrontend";
import { ReservaEstado } from "@/types/enums";

const API_URL = import.meta.env.VITE_API_URL;

export interface FiltrosReservas {
  estado?: ReservaEstado | "TODOS";
  espacioId?: string;
  socioId?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

type ComprobantePayload = {
  comprobanteUrl: string;
  comprobanteName: string;
  comprobanteMime: string;
  comprobanteSize: number;
};

export function useReservasAdmin() {
  const { token } = useAuth();

  const [reservas, setReservas] = useState<ReservaFrontend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<FiltrosReservas>({
    estado: "TODOS",
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchReservas = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filtros.estado && filtros.estado !== "TODOS") {
        params.append("estado", filtros.estado);
      }
      if (filtros.espacioId) params.append("espacioId", filtros.espacioId);
      if (filtros.socioId) params.append("socioId", filtros.socioId);
      if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
      if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);

      const resp = await fetch(`${API_URL}/api/reservas/admin?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });

      const json = await resp.json();

      if (!resp.ok || json.ok === false) {
        throw new Error(json.error || "ERROR_FETCH_RESERVAS");
      }

      const list: ReservaDTO[] = json.data ?? [];
      setReservas(list.map(normalizarReserva));
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("❌ Error reservas admin:", err);
      setError(err.message || "ERROR_INESPERADO");
    } finally {
      setLoading(false);
    }
  }, [token, filtros]);

  useEffect(() => {
    fetchReservas();
    return () => abortRef.current?.abort();
  }, [fetchReservas]);

  const updateEstado = async (id: string, estado: ReservaEstado, motivo?: string) => {
    if (!token) throw new Error("NO_AUTH");

    const resp = await fetch(`${API_URL}/api/reservas/${id}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado, motivo }),
    });

    const json = await resp.json();
    if (!resp.ok || json.ok === false) {
      throw new Error(json.error || "ERROR_UPDATE_ESTADO");
    }

    await fetchReservas();
  };

  const cancelarReserva = async (id: string, motivo?: string) => {
    await updateEstado(id, ReservaEstado.CANCELADA, motivo);
  };

  const subirComprobanteAdmin = async (reservaId: string, payload: ComprobantePayload) => {
    if (!token) throw new Error("NO_AUTH");

    const resp = await fetch(`${API_URL}/api/admin/reservas/${reservaId}/comprobante`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await resp.json();
    if (!resp.ok || json.ok === false) {
      throw new Error(json.error || "ERROR_SUBIR_COMPROBANTE");
    }

    await fetchReservas();
  };

  const confirmarReservaManual = async (reservaId: string) => {
    if (!token) throw new Error("NO_AUTH");

    const resp = await fetch(`${API_URL}/api/admin/reservas/${reservaId}/confirmar`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await resp.json();
    if (!resp.ok || json.ok === false) {
      throw new Error(json.error || "ERROR_CONFIRMAR_RESERVA");
    }

    await fetchReservas();
  };

  return {
    reservas,
    loading,
    error,

    filtros,
    setFiltros,

    reload: fetchReservas,

    updateEstado,
    cancelarReserva,

    subirComprobanteAdmin,
    confirmarReservaManual,
  };
}
