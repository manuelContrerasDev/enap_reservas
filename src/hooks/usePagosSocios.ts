import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export function usePagosSocio() {
  const { token } = useAuth();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const resp = await fetch(`${API_URL}/api/pagos/mios`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setPagos([]);
        return;
      }

      setPagos(data.pagos);
    } catch (err) {
      console.error("Error pagos socio:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { pagos, loading, reload: cargar };
}
