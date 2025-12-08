// src/hooks/useReservasAdmin.ts
import { useEffect, useState, useCallback } from "react";
import { ReservaFrontend } from "@/types/ReservaFrontend";
import { ReservaEstado } from "@/types/enums";
import { useAuth } from "@/context/auth"
;
import { useNotificacion } from "@/context/NotificacionContext";

const API_URL = import.meta.env.VITE_API_URL;

export interface FiltrosReservas {
  estado?: ReservaEstado | "TODOS";
  espacioId?: string;
  socioId?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export function useReservasAdmin() {
  const { token } = useAuth();
  const { agregarNotificacion } = useNotificacion();

  const [reservas, setReservas] = useState<ReservaFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtros, setFiltros] = useState<FiltrosReservas>({
    estado: "TODOS",
  });

  /* ============================================================
   *  🟦 CARGAR RESERVAS ADMIN
   * ============================================================ */
  const fetchReservas = useCallback(async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (filtros.estado && filtros.estado !== "TODOS")
        params.append("estado", filtros.estado);

      if (filtros.espacioId) params.append("espacioId", filtros.espacioId);
      if (filtros.socioId) params.append("socioId", filtros.socioId);
      if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio);
      if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin);

      const res = await fetch(
        `${API_URL}/api/reservas/admin?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error cargando reservas");

      // Importante: backend devuelve { ok, meta, data }
      setReservas(data.data || []);
    } catch (err) {
      console.error("❌ Error cargando reservas admin:", err);
      agregarNotificacion("Error al cargar reservas", "error");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }, [filtros, token]);

  useEffect(() => {
    if (token) fetchReservas();
  }, [fetchReservas, token]);

  /* ============================================================
   *  🟢 ACTUALIZAR ESTADO DE RESERVA
   * ============================================================ */
  const updateEstado = async (id: string, estado: ReservaEstado) => {
    try {
      const res = await fetch(`${API_URL}/api/reservas/${id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ estado }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Actualizamos lista local sin recargar todo
      setReservas((prev) =>
        prev.map((r) => (r.id === id ? { ...r, estado } : r))
      );

      agregarNotificacion("Estado actualizado", "success");
      return { ok: true };
    } catch (err: any) {
      agregarNotificacion(err.message || "Error al actualizar estado", "error");
      return { ok: false };
    }
  };

  /* ============================================================
   *  🔴 ELIMINAR RESERVA
   * ============================================================ */
  const eliminarReserva = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/reservas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Eliminar visualmente de la tabla
      setReservas((prev) => prev.filter((r) => r.id !== id));

      agregarNotificacion("Reserva eliminada", "success");
      return { ok: true };
    } catch (err: any) {
      agregarNotificacion(err.message || "Error al eliminar", "error");
      return { ok: false };
    }
  };

  return {
    reservas,
    loading,
    filtros,
    setFiltros,
    reload: fetchReservas,
    updateEstado,
    eliminarReserva, // ← AGREGADO
  };
}
