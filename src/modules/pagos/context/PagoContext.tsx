import { createContext, useContext, useState, ReactNode } from "react";
import type { InitPagoResponse } from "../types/initPago";

export type PagoEstado =
  | "idle"
  | "loading"
  | "redirecting"
  | "success"
  | "error";

interface PagoContextType {
  estado: PagoEstado;
  mensaje: string | null;

  pagoInfo?: InitPagoResponse | null;

  setEstado: (estado: PagoEstado) => void;
  setMensaje: (msg: string | null) => void;
  setPagoInfo: (data: InitPagoResponse | null) => void;

  resetPago: () => void;
}

const PagoContext = createContext<PagoContextType | undefined>(undefined);

export function PagoProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<PagoEstado>("idle");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [pagoInfo, setPagoInfo] = useState<InitPagoResponse | null>(null);

  const resetPago = () => {
    setEstado("idle");
    setMensaje(null);
    setPagoInfo(null);
  };

  return (
    <PagoContext.Provider
      value={{ estado, mensaje, pagoInfo, setEstado, setMensaje, setPagoInfo, resetPago }}
    >
      {children}
    </PagoContext.Provider>
  );
}

export function usePagoContext() {
  const ctx = useContext(PagoContext);
  if (!ctx) throw new Error("usePagoContext debe usarse dentro del PagoProvider");
  return ctx;
}
