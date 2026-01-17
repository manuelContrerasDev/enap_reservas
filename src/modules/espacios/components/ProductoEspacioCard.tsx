// src/modules/espacios/components/ProductoEspacioCard.tsx
import React from "react";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";

import EspacioDetalleHeader from "./EspacioDetalleHeader";
import EspacioDetalleCTA from "./EspacioDetalleCTA";

interface Props {
  espacio: EspacioDTO;
  precioBase: number;

  fechaSeleccionada?: string | null;
  ocupadoEnFecha?: boolean;

  onReservar: () => void;
}

export default function ProductoEspacioCard({
  espacio,
  precioBase,
  fechaSeleccionada,
  ocupadoEnFecha = false,
  onReservar,
}: Props) {
  return (
    <section className="bg-white rounded-2xl shadow border overflow-hidden">
      {/* HEADER */}
      <EspacioDetalleHeader
        nombre={espacio.nombre}
        tipo={espacio.tipo}
        descripcion={espacio.descripcion}
        imagenUrl={espacio.imagenUrl}
        capacidad={espacio.capacidad}
        precioBase={precioBase}
        modalidadCobro={espacio.modalidadCobro}
      />

      {/* CTA */}
      <div className="p-5">
        <EspacioDetalleCTA
          activo={espacio.activo}
          visible={espacio.visible}
          ocupadoEnFecha={ocupadoEnFecha}
          onReservar={onReservar}
        />
      </div>
    </section>
  );
}
