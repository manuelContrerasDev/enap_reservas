import { useState } from "react";
import { adminReservaService } from "@/services/adminReservaService";
import {
  ReservaManualBackendPayload,
  ReservaManualResult,
} from "@/types/reservaManualBackend";

export const useReservaManual = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ReservaManualResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crear = async (payload: ReservaManualBackendPayload) => {
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await adminReservaService.crearManual(payload);

      if (!res.ok) {
        setError(res.error ?? "Error al crear la reserva manual");
        return res;
      }

      if (res.data) {
        setResultado(res.data);
      }

      return res;
    } catch (err: any) {
      console.error("Error inesperado en useReservaManual:", err);
      setError("Error inesperado del servidor");
      return { ok: false, error: "Error inesperado del servidor" };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    resultado,
    error,
    crear,
  };
};
