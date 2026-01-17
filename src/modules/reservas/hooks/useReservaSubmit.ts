// ============================================================
// useReservaSubmit.ts — Submit reserva (PRO)
// ============================================================

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useReserva } from "@/modules/reservas/context/ReservaContext";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";

import {
  reservaFrontendSchema,
  type ReservaFrontendType,
} from "@/modules/reservas/schemas/reserva.schema";

import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import { mapCrearReservaPayload } from "@/modules/reservas/utils/mapPayload";
import { PATHS } from "@/routes/paths";

export function useReservaSubmit(
  espacio: EspacioDTO | null,
  validar: (data: ReservaFrontendType) => boolean
) {
  const navigate = useNavigate();
  const { crearReservaEnServidor } = useReserva();
  const { agregarNotificacion } = useNotificacion();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data: ReservaFrontendType) => {
      if (!espacio || isSubmitting) return;
      if (!validar(data)) return;

      try {
        setIsSubmitting(true);

        // ✅ Normalización total
        const parsed = reservaFrontendSchema.parse(data);

        const toIsoLocalMidnight = (ymd: string) =>
          new Date(`${ymd}T00:00:00`).toISOString();

        const payload = mapCrearReservaPayload(
          {
            ...parsed,
            fechaInicio: toIsoLocalMidnight(parsed.fechaInicio),
            fechaFin: toIsoLocalMidnight(parsed.fechaFin),
          },
          espacio.id
        );

        const reservaId = await crearReservaEnServidor(payload);
        if (!reservaId) return;

        agregarNotificacion("Reserva creada correctamente", "success");
        navigate(`${PATHS.RESERVA_PREVIEW}?reservaId=${reservaId}`);
      } catch (e: any) {
        console.error("❌ submit reserva:", e);
        agregarNotificacion(
          e?.message ?? "No se pudo crear la reserva",
          "error"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      espacio,
      validar,
      crearReservaEnServidor,
      agregarNotificacion,
      navigate,
      isSubmitting,
    ]
  );

  return { onSubmit, isSubmitting };
}
