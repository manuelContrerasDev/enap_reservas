// src/context/PagoContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

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
  iniciarPago: (reservaId: string) => Promise<void>;
  resetPago: () => void;
}

const PagoContext = createContext<PagoContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_URL;

export const PagoProvider = ({ children }: { children: ReactNode }) => {
  const [estado, setEstado] = useState<EstadoPago>("idle");
  const [mensaje, setMensaje] = useState<string | null>(null);

  /* ============================================================
   * 🟦 Iniciar checkout Webpay
   * ============================================================ */
  const iniciarPago = useCallback(async (reservaId: string) => {
    try {
      if (estado === "loading" || estado === "redirecting") return;

      setEstado("loading");
      setMensaje(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Tu sesión ha expirado. Vuelve a iniciar sesión.");

      const resp = await fetch(`${API_URL}/api/pagos/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservaId }),
      });

      const data: CheckoutInitResponse = await resp.json();

      if (!resp.ok || !data.ok) {
        console.error("❌ Error backend iniciarPago:", data);
        throw new Error(data.error ?? "No se pudo iniciar el pago Webpay.");
      }

      if (!data.checkoutUrl) {
        throw new Error("No se recibió la URL de Webpay desde el servidor.");
      }

      // Estado previo al redirect
      setEstado("redirecting");

      // Redirección hacia Webpay
      window.location.href = data.checkoutUrl;

    } catch (err: any) {
      console.error("❌ Error iniciarPago:", err);

      setEstado("error");
      setMensaje(
        err?.message ??
          "Ocurrió un error desconocido al iniciar el proceso de pago."
      );
    }
  }, [estado]);

  /* ============================================================
   * 🔄 Reset manual (para reintentos)
   * ============================================================ */
  const resetPago = () => {
    setEstado("idle");
    setMensaje(null);
  };

  return (
    <PagoContext.Provider
      value={{
        estado,
        mensaje,
        iniciarPago,
        resetPago,
      }}
    >
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
