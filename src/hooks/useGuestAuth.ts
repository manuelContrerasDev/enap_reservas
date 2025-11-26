import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/* ============================================================
 * TIPOS sincronizados con backend
 * ============================================================*/
export interface GuestAuthorization {
  id: string;
  socioId: string;
  invitadoId: string;
  createdAt: string;
  invitado: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
  };
}

interface CreateGuestInput {
  email: string;
  name?: string;
  mensaje?: string;
}

/* ============================================================
 * HOOK: useGuestAuth
 * ============================================================*/
export function useGuestAuth() {
  const [guests, setGuests] = useState<GuestAuthorization[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  /* ============================================================
   * GET — Listar invitados del socio
   * ============================================================*/
  const fetchGuests = useCallback(async () => {
    if (!token) return;

    try {
      setRefreshing(true);
      const res = await fetch(`${API_URL}/guest/mios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Error cargando invitados");

      setGuests(json.data);
      setError(null);
    } catch (err: any) {
      setError(err.message ?? "Error inesperado");
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  /* Auto-cargar al montar */
  useEffect(() => {
    if (!loading && guests.length === 0) {
      setLoading(true);
      fetchGuests().finally(() => setLoading(false));
    }
  }, [fetchGuests]);

  /* ============================================================
   * POST — Crear nuevo invitado autorizado
   * ============================================================*/
  const addGuest = useCallback(
    async (payload: CreateGuestInput) => {
      try {
        const res = await fetch(`${API_URL}/guest`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "No se pudo crear invitado");

        await fetchGuests();
        return { ok: true };
      } catch (err: any) {
        return { ok: false, error: err.message };
      }
    },
    [token, fetchGuests]
  );

  /* ============================================================
   * DELETE — Revocar invitado autorizado
   * ============================================================*/
  const deleteGuest = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`${API_URL}/guest/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "No se pudo eliminar invitado");

        // Actualizar rápido local
        setGuests((prev) => prev.filter((g) => g.id !== id));

        return { ok: true };
      } catch (err: any) {
        return { ok: false, error: err.message };
      }
    },
    [token]
  );

  return {
    guests,
    loading,
    refreshing,
    error,

    fetchGuests,
    addGuest,
    deleteGuest,
  };
}
