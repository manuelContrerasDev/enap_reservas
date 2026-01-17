import { useState } from "react";
import { actualizarInvitados } from "@/modules/reservas/api/reservas.api";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";

export function useActualizarInvitados() {
  const [loading, setLoading] = useState(false);
  const { agregarNotificacion } = useNotificacion();

  const enviar = async (reservaId: string, invitados: any[]) => {
    try {
      setLoading(true);

      const res = await actualizarInvitados(reservaId, invitados);

      agregarNotificacion("Invitados actualizados correctamente", "success");

      return res;
    } catch (error: any) {
      const msg =
        error?.response?.data?.error ??
        "Error al actualizar la lista de invitados";

      agregarNotificacion(msg, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { enviar, loading };
}
