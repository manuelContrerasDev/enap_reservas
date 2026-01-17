import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/modules/auth/hooks";

import { normalizarReserva } from "@/modules/reservas/types/normalizarReserva";
import type { ReservaDTO } from "@/modules/reservas/types/ReservaDTO";
import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";
import { ReservaEstado } from "@/shared/types/enums";

const API_URL = import.meta.env.VITE_API_URL;

/* ============================================================
 * HOOK ADMIN RESERVAS (FASE 2 READY)
 * ============================================================ */
export function useReservasAdmin() {
  const { token } = useAuth();

  const [reservas, setReservas] = useState<ReservaFrontend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtros, setFiltros] = useState<{
    estado?: ReservaEstado | "TODOS";
    espacioId?: string;
    fechaInicio?: string;
    fechaFin?: string;
  }>({ estado: "TODOS" });

  const abortRef = useRef<AbortController | null>(null);

  /* ============================================================
   * 📦 FETCH
   * ============================================================ */
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
      if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
      if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);

      const resp = await fetch(
        `${API_URL}/api/reservas/admin?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );

      const json = await resp.json();
      if (!resp.ok || json.ok === false) {
        throw new Error(json.error || "ERROR_FETCH_RESERVAS");
      }

      const list: ReservaDTO[] = json.data ?? [];
      setReservas(list.map(normalizarReserva));
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      setError(err.message || "ERROR_INESPERADO");
    } finally {
      setLoading(false);
    }
  }, [token, filtros]);

  useEffect(() => {
    fetchReservas();
    return () => abortRef.current?.abort();
  }, [fetchReservas]);

  /* ============================================================
   * ❌ CANCELAR RESERVA (ADMIN)
   * ============================================================ */
  const cancelarReserva = async (id: string, motivo?: string) => {
    if (!token) throw new Error("NO_AUTH");

    const resp = await fetch(
      `${API_URL}/api/admin/reservas/${id}/cancelar`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo }),
      }
    );

    const json = await resp.json();
    if (!resp.ok || json.ok === false) {
      throw new Error(json.error || "ERROR_CANCELAR_RESERVA");
    }

    await fetchReservas();
  };

  /* ============================================================
   * 📎 SUBIR COMPROBANTE
   * ============================================================ */
  const subirComprobanteAdmin = async (reservaId: string, payload: any) => {
    if (!token) throw new Error("NO_AUTH");

    const resp = await fetch(
      `${API_URL}/api/admin/reservas/${reservaId}/comprobante`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const json = await resp.json();
    if (!resp.ok || json.ok === false) {
      throw new Error(json.error || "ERROR_SUBIR_COMPROBANTE");
    }

    await fetchReservas();
  };

  /* ============================================================
   * 💰 VALIDACIÓN FINANCIERA
   * ============================================================ */
  const aprobarPagoReserva = async (
    reservaId: string,
    payload?: { monto?: number; referencia?: string; nota?: string }
  ) => {
    if (!token) throw new Error("NO_AUTH");

    const resp = await fetch(
      `${API_URL}/api/admin/reservas/${reservaId}/confirmar`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload ?? {}),
      }
    );

    const json = await resp.json();
    if (!resp.ok || json.ok === false) {
      throw new Error(json.error || "ERROR_APROBAR_PAGO");
    }

    await fetchReservas();
  };

  const rechazarPagoReserva = async (
    reservaId: string,
    payload: { motivo: string }
  ) => {
    if (!token) throw new Error("NO_AUTH");
    if (!payload?.motivo?.trim()) throw new Error("MOTIVO_REQUERIDO");

    const resp = await fetch(
      `${API_URL}/api/admin/reservas/${reservaId}/rechazar`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ motivo: payload.motivo }),
      }
    );

    const json = await resp.json();
    if (!resp.ok || json.ok === false) {
      throw new Error(json.error || "ERROR_RECHAZAR_PAGO");
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

    cancelarReserva,
    subirComprobanteAdmin,
    aprobarPagoReserva,
    rechazarPagoReserva,
  };
}
