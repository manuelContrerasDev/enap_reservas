// src/context/PagoContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { useReserva } from "@/context/ReservaContext";
import { useAuth } from "@/context/AuthContext";

interface CheckoutInitResponse {
  ok: boolean;
  pagoId?: string;
  checkoutUrl?: string;
  error?: string;
}

type EstadoPago = "idle" | "loading" | "redirecting" | "success" | "error";

interface PagoContextType {
  estado: EstadoPago;
  mensaje: string | null;
  iniciarPago: (reservaId: string, monto: number) => Promise<void>;
  resetPago: () => void;
}

const PagoContext = createContext<PagoContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL;

export const PagoProvider = ({ children }: { children: ReactNode }) => {
  const [estado, setEstado] = useState<EstadoPago>("idle");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const { token } = useAuth();
  const { reservaActual } = useReserva();

  /* ============================================================
   * 🟦 Iniciar checkout Webpay (CORREGIDO)
   * ============================================================ */
  const iniciarPago = useCallback(async (reservaId: string, monto: number) => {
    try {
      setEstado((prev) => (prev === "loading" ? prev : "loading"));
      setMensaje(null);

      const authToken = token ?? localStorage.getItem("token");
      if (!authToken) throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.");

      if (!monto || monto <= 0) {
        throw new Error("El monto del pago no es válido.");
      }

      const resp = await fetch(`${API_URL}/api/pagos/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          reservaId,
          amountClp: monto, // 👈 ENVÍO DEL MONTO CORRECTO
        }),
      });

      const data: CheckoutInitResponse = await resp.json();

      if (!resp.ok || !data.ok) {
        throw new Error(data.error ?? "No se pudo iniciar el pago Webpay.");
      }

      if (!data.checkoutUrl) {
        throw new Error("El servidor no entregó la URL de Webpay.");
      }

      setEstado("redirecting");
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      console.error("❌ Error iniciarPago:", err);

      setEstado("error");
      setMensaje(err.message ?? "Error desconocido al iniciar el pago Webpay.");
    }
  }, [token]);

  /* ============================================================
   * 🔄 Reset manual
   * ============================================================ */
  const resetPago = () => {
    setEstado("idle");
    setMensaje(null);
  };

  return (
    <PagoContext.Provider value={{ estado, mensaje, iniciarPago, resetPago }}>
      {children}
    </PagoContext.Provider>
  );
};

export const usePago = () => {
  const ctx = useContext(PagoContext);
  if (!ctx) throw new Error("usePago debe usarse dentro del PagoProvider");
  return ctx;
};
