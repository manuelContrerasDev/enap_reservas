// src/modules/espacios/components/EspacioCardSocio.tsx
import React, { memo, KeyboardEvent, useCallback } from "react";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import { PATHS } from "@/routes/paths";
import { useAuth } from "@/modules/auth/hooks";

import EspacioCardBase from "./EspacioCardBase";
import EspacioDetalleHeader from "./EspacioDetalleHeader";
import EspacioDetalleCTA from "./EspacioDetalleCTA";

interface Props {
  espacio: EspacioDTO;
  fechaFiltro: string | null;
  ocupadoEnFecha: boolean;
}

const EspacioCardSocio: React.FC<Props> = memo(
  ({ espacio, fechaFiltro, ocupadoEnFecha }) => {
    const { role } = useAuth();
    const navigate = useNavigate();

    const precioBase =
      role === "EXTERNO"
        ? espacio.precioBaseExterno
        : espacio.precioBaseSocio;

    const puedeReservar =
      espacio.activo &&
      espacio.visible &&
      !(fechaFiltro && ocupadoEnFecha);

    const goToReserva = useCallback(() => {
      if (!puedeReservar) return;

      const base = PATHS.RESERVA_ID.replace(":id", espacio.id);
      fechaFiltro
        ? navigate(`${base}?fecha=${fechaFiltro}`)
        : navigate(base);
    }, [puedeReservar, espacio.id, fechaFiltro, navigate]);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        goToReserva();
      }
    };

    return (
      <EspacioCardBase
        puedeInteractuar={puedeReservar}
        onClick={goToReserva}
        onKeyDown={handleKeyDown}
      >
        <EspacioDetalleHeader
          nombre={espacio.nombre}
          tipo={espacio.tipo}
          descripcion={espacio.descripcion}
          imagenUrl={espacio.imagenUrl}
          capacidad={espacio.capacidad}
          precioBase={precioBase}
          modalidadCobro={espacio.modalidadCobro}
        />

        {fechaFiltro && (
          <div className="px-5 pt-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full ${
                ocupadoEnFecha
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <CalendarDays size={12} />
              {ocupadoEnFecha ? "Ocupado" : "Disponible"}
            </span>
          </div>
        )}

        <div className="p-5 pt-3">
          <EspacioDetalleCTA
            espacioId={espacio.id}
            tipoEspacio={espacio.tipo}
            activo={espacio.activo}
            visible={espacio.visible}
            ocupadoEnFecha={ocupadoEnFecha}
            admitePiscina={espacio.tipo !== "PISCINA"}
            onReservar={goToReserva}
            onReservarCompuesto={() =>
              navigate(`${PATHS.RESERVA_ID.replace(":id", espacio.id)}?compuesto=piscina`)
            }
          />
        </div>
      </EspacioCardBase>
    );
  }
);

export default EspacioCardSocio;
