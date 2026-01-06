// src/modules/pagos/hooks/usePago.ts

import { useCallback } from "react";
import { usePagoContext } from "../context/PagoContext";
import { initPago } from "../services/initPago";
import { useNotificacion } from "@/context/NotificacionContext";

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
        setPagoInfo(data);

        setEstado("redirecting");

        // 🔥 Webpay redirige → aquí termina el flujo
        window.location.href = data.checkoutUrl;

      } catch (err: any) {
        console.error("❌ Error iniciando pago:", err);

        setEstado("error");
        setMensaje(err?.message ?? "Error iniciando pago");

        agregarNotificacion(
          err?.message ?? "No se pudo iniciar el pago",
          "error"
        );
      }
    },
    [setEstado, setMensaje, setPagoInfo, agregarNotificacion]
  );

  return {
    estado,
    iniciarPago,
    resetPago, // ← se usará en ResultadoPagoPage
  };
}
