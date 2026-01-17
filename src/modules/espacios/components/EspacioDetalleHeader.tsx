// src/modules/espacios/components/EspacioDetalleHeader.tsx
import React from "react";
import { Users } from "lucide-react";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

interface Props {
  nombre: string;
  tipo: "CABANA" | "QUINCHO" | "PISCINA";

  descripcion?: string | null;
  imagenUrl?: string | null;

  capacidad: number;

  /** Precio ya resuelto por rol */
  precioBase: number;
  modalidadCobro: "POR_NOCHE" | "POR_DIA" | "POR_PERSONA";
}

function modalidadLabel(modalidad: Props["modalidadCobro"]) {
  switch (modalidad) {
    case "POR_NOCHE":
      return "/ noche";
    case "POR_PERSONA":
      return "/ persona";
    default:
      return "/ día";
  }
}

export default function EspacioDetalleHeader({
  nombre,
  tipo,
  descripcion,
  imagenUrl,
  capacidad,
  precioBase,
  modalidadCobro,
}: Props) {
  const imagenFinal = imagenUrl?.trim()
    ? imagenUrl
    : FALLBACK_IMG;

  return (
    <section className="bg-white rounded-2xl shadow border overflow-hidden">
      {/* ================= IMAGEN ================= */}
      <div className="relative aspect-[16/9]">
        <img
          src={imagenFinal}
          alt={nombre}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <span className="inline-block mb-1 px-3 py-1 text-xs font-semibold rounded-full bg-white/90 text-[#003B4D]">
              {tipo}
            </span>

            <h1 className="text-2xl font-bold text-white leading-tight">
              {nombre}
            </h1>
          </div>

          <div className="text-right">
            <div className="text-lg font-bold text-[#FFD84D]">
              {CLP.format(precioBase)}{" "}
              <span className="text-sm font-medium text-white">
                {modalidadLabel(modalidadCobro)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= INFO ================= */}
      <div className="p-5 space-y-3">
        {descripcion && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {descripcion}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-800">
          <Users size={16} />
          Capacidad máxima:{" "}
          <strong>{capacidad}</strong> personas
        </div>
      </div>
    </section>
  );
}
