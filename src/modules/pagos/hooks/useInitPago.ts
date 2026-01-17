import { useCallback } from "react";
import { initPago } from "../api/initPago.api";
import { usePagoContext } from "../context/PagoContext";

export function useInitPago() {
  const { setEstado, setMensaje, setPagoInfo } = usePagoContext();

  return useCallback(async (reservaId: string, monto: number) => {
    try {
      setEstado("loading");

      const data = await initPago(reservaId);

      setPagoInfo(data);
      setEstado("redirecting");

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setEstado("error");
      setMensaje(err.message ?? "Error al iniciar el pago");
    }
  }, []);
}
