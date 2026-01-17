import { useState, useCallback } from "react";
import { http } from "@/shared/api/http";

interface Socio {
  id: string;
  name: string | null;
  email: string;
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
      const data = await http<{ users: Socio[] }>(
        `/admin/users/search?q=${query}`
      );
      setResultados(data.users);
    } catch (e: any) {
      setError(e.message);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { buscar, resultados, loading, error };
}
