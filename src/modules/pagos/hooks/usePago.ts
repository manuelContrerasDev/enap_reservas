import { useCallback } from "react";
import { usePagoContext } from "../context/PagoContext";
import { initPago } from "../services/initPago";
import { confirmPago } from "../services/confirmPago";
import { useNotificacion } from "@/context/NotificacionContext";

export function usePago() {
  const { estado, setEstado, setMensaje, setPagoInfo, resetPago } = usePagoContext();
  const { agregarNotificacion } = useNotificacion();

  const iniciarPago = useCallback(async (reservaId: string) => {
    try {
      setEstado("loading");
      setMensaje(null);

      const data = await initPago(reservaId);
      setPagoInfo(data);

      setEstado("redirecting");

      // redirigir form POST Webpay
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.url;

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "token_ws";
      input.value = data.token;

      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setEstado("error");
      setMensaje(err.message);
      agregarNotificacion(err.message, "error");
    }
  }, []);

  const confirmar = useCallback(async (tokenWs: string) => {
    try {
      setEstado("loading");

      const result = await confirmPago(tokenWs);

      setEstado("success");
      return result; // { reserva, pago, status }
    } catch (err: any) {
      setEstado("error");
      setMensaje(err.message);
      return null;
    }
  }, []);

  return {
    estado,
    iniciarPago,
    confirmar,
    resetPago,
  };
}
