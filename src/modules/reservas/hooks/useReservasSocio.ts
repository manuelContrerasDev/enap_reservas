import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/auth";
import { normalizarReserva } from "@/utils/normalizarReserva";
import type { ReservaFrontend } from "@/types/ReservaFrontend";

const API_URL = import.meta.env.VITE_API_URL;

export function useReservasSocio() {
  const { token } = useAuth();

  const [reservas, setReservas] = useState<ReservaFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const resp = await fetch(`${API_URL}/api/reservas/mias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json();

      if (!resp.ok || data.ok === false) {
        console.error("Error cargando reservas del socio:", data);
        setReservas([]);
        return;
      }

      const normalizadas = data.reservas.map(normalizarReserva);

      setReservas(normalizadas);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    reservas,
    loading,
    reload: cargar,
  };
}
