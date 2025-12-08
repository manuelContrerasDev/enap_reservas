import { ReservaEstado } from "@/types/enums";

const API_URL = import.meta.env.VITE_API_URL;

export function useReservaEstado(reload: () => void) {

  const actualizarEstado = async (id: string, estado: ReservaEstado) => {
    try {
      const res = await fetch(`${API_URL}/api/reservas/${id}/estado`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error actualizando estado");
      
      reload(); // refresca listados
      return { ok: true };
    } catch (err: any) {
      console.error("Error cambiando estado:", err);
      return { ok: false, error: err.message };
    }
  };

  return { actualizarEstado };
}
