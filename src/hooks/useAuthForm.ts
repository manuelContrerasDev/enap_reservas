import { useState } from "react";
import { ZodSchema } from "zod";

const API_URL = import.meta.env.VITE_API_URL;

export function useAuthForm<T>(schema: ZodSchema<T>, endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(data: Partial<T>) {
    setLoading(true);
    setServerError(null);

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      setLoading(false);
      return {
        ok: false,
        error: parsed.error.flatten().fieldErrors,
      };
    }

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();

      if (!res.ok) {
        setLoading(false);
        setServerError(json.message || json.error || "Error desconocido.");
        return { ok: false, error: json.message || json.error };
      }

      setLoading(false);
      return { ok: true, data: json };

    } catch (e) {
      setLoading(false);
      setServerError("Error de conexión.");
      return { ok: false };
    }
  }

  return {
    loading,
    serverError,
    handleSubmit,
  };
}
