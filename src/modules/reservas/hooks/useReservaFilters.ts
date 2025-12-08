import { useEffect, useMemo, useState } from "react";
import type { EstadoReserva } from "@/context/ReservaContext";

export type FechaOp = ">" | "<";

export interface ReservaFilters {
  fUsuario: string;
  fEspacio: string;
  fEstado: "todas" | EstadoReserva;
  fFechaOp: FechaOp;
  fFecha: string; // YYYY-MM-DD
}

/** Maneja estado de filtros y expone clear() + isEmpty */
export function useReservaFilters(onChange?: () => void) {
  const [fUsuario, setFUsuario] = useState("");
  const [fEspacio, setFEspacio] = useState("");
  const [fEstado, setFEstado] = useState<"todas" | EstadoReserva>("todas");
  const [fFechaOp, setFFechaOp] = useState<FechaOp>(">");
  const [fFecha, setFFecha] = useState<string>("");

  useEffect(() => {
    onChange?.();
  }, [fUsuario, fEspacio, fEstado, fFecha, fFechaOp, onChange]);

  const isEmpty = useMemo(
    () => fUsuario === "" && fEspacio === "" && fEstado === "todas" && fFecha === "",
    [fUsuario, fEspacio, fEstado, fFecha]
  );

  const clear = () => {
    setFUsuario("");
    setFEspacio("");
    setFEstado("todas");
    setFFecha("");
    setFFechaOp(">");
  };

  return {
    fUsuario, setFUsuario,
    fEspacio, setFEspacio,
    fEstado, setFEstado,
    fFechaOp, setFFechaOp,
    fFecha, setFFecha,
    isEmpty,
    clear,
  };
}
