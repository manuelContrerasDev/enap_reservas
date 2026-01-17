import { useCallback } from "react";
import { usePagoContext } from "../context/PagoContext";
import { initPago } from "../api/initPago.api";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";

export function usePago() {
  const {
    estado,
    setEstado,
    setMensaje,
    setPagoInfo,
    resetPago,
  } = usePagoContext();

  const { agregarNotificacion } = useNotificacion();

  const iniciarPago = useCallback(
    async (reservaId: string) => {
      try {
        setEstado("loading");
        setMensaje(null);

        const data = await initPago(reservaId);

        if (!data.checkoutUrl) {
          throw new Error("El servidor no entregó la URL de pago");
        }

        setPagoInfo(data);
        setEstado("redirecting");

        // 🔥 redirección segura
        window.location.href = data.checkoutUrl;

      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "No se pudo iniciar el pago";

        console.error("❌ Error iniciando pago:", err);

        setEstado("error");
        setMensaje(message);

        agregarNotificacion(message, "error");
      }
    },
    [setEstado, setMensaje, setPagoInfo, agregarNotificacion]
  );

  return {
    estado,
    iniciarPago,
    resetPago,
  };
}
