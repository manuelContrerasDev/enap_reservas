// src/modules/admin/components/hooks/useBuscarSocios.ts
import { useState, useCallback } from "react";

interface Socio {
  id: string;
  name: string | null;
  email: string;
  rut: string | null;
  role: string;
}

interface SearchResponse {
  users: Socio[];
}

export function useBuscarSocios() {
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<Socio[]>([]);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResultados([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/users/search?q=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error buscando socios");
      }

      const data: SearchResponse = await res.json();

      setResultados(data.users);
    } catch (err: any) {
      setError(err.message);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    buscar,
    resultados,
    loading,
    error,
  };
}
