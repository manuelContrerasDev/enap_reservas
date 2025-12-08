// src/context/PagoContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

import { useReserva } from "@/context/ReservaContext";
import { useAuth } from "@/context/auth";
import { api } from "@/lib/axios";

/* ============================================================
 * Tipados
 * ============================================================ */

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

/* ============================================================
 * Context
 * ============================================================ */

const PagoContext = createContext<PagoContextType | undefined>(undefined);

/* ============================================================
 * Provider
 * ============================================================ */

export const PagoProvider = ({ children }: { children: ReactNode }) => {
  const [estado, setEstado] = useState<EstadoPago>("idle");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const { isAuthenticated } = useAuth();
  const { reservaActual } = useReserva();

  /* ============================================================
   * 🟦 Iniciar checkout Webpay (REFORMADO)
   * ============================================================ */
  const iniciarPago = useCallback(
    async (reservaId: string, monto: number) => {
      try {
        setEstado("loading");
        setMensaje(null);

        if (!isAuthenticated) {
          throw new Error("Tu sesión ha expirado. Inicia sesión nuevamente.");
        }

        if (!reservaId) {
          throw new Error("ID de reserva no válido.");
        }

        if (!monto || monto <= 0) {
          throw new Error("El monto del pago no es válido.");
        }

        // 🔥 Usamos axios (api) con Authorization ya configurado por AuthContext
        const resp = await api.post<CheckoutInitResponse>(
          "/pagos/checkout",
          {
            reservaId,
            amountClp: monto,
          }
        );

        if (!resp.data.ok) {
          throw new Error(resp.data.error ?? "No se pudo iniciar el pago.");
        }

        if (!resp.data.checkoutUrl) {
          throw new Error("El servidor no entregó la URL de Webpay.");
        }

        // Redirigir al checkout
        setEstado("redirecting");
        window.location.href = resp.data.checkoutUrl;
      } catch (err: any) {
        console.error("❌ Error iniciarPago:", err);

        setEstado("error");
        setMensaje(err.message ?? "Error desconocido al iniciar el pago Webpay.");
      }
    },
    [isAuthenticated]
  );

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

/* ============================================================
 * Hook
 * ============================================================ */
export const usePago = () => {
  const ctx = useContext(PagoContext);
  if (!ctx) throw new Error("usePago debe usarse dentro del PagoProvider");
  return ctx;
};
