// ============================================================
// useReservaManual.ts — ENAP 2025
// Hook ADMIN crear reserva manual (SYNC)
// ============================================================

import { useState } from "react";
import { adminReservaService } from "@/modules/admin/reservas/services/adminReservaService";

import type {
  ReservaManualBackendPayload,
  ReservaManualResult,
} from "@/types/admin/reservaManualBackend";

interface CrearReservaResponse {
  ok: boolean;
  data?: ReservaManualResult;
  error?: string;
}

export const useReservaManual = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ReservaManualResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crear reserva manual
   * payload → viene VALIDADO y PARSEADO por Zod (z.output)
   */
  const crear = async (
    payload: ReservaManualBackendPayload
  ): Promise<CrearReservaResponse> => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await adminReservaService.crearManual(payload);

      if (!res.ok) {
        const mensaje =
          res.error ??
          "No fue posible crear la reserva manual. Intente nuevamente.";

        setError(mensaje);
        return { ok: false, error: mensaje };
      }

      if (!res.data) {
        const mensaje = "Respuesta inválida del servidor";
        setError(mensaje);
        return { ok: false, error: mensaje };
      }

      setResultado(res.data);

      return {
        ok: true,
        data: res.data,
      };
    } catch (err) {
      console.error("[useReservaManual] Error inesperado:", err);

      const mensaje = "Error inesperado del servidor";
      setError(mensaje);

      return {
        ok: false,
        error: mensaje,
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Permite limpiar el estado manualmente
   * (útil si vuelves a la página sin recargar)
   */
  const reset = () => {
    setResultado(null);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    resultado,
    error,
    crear,
    reset,
  };
};
