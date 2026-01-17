// src/modules/reservas/hooks/useReservaValidator.ts
import { useCallback } from "react";

import type { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import type { NotificacionContextType } from "@/shared/providers/NotificacionProvider";

import {
  validarFechasConBloques,
  type BloqueFecha,
} from "../utils/validarFechas";
import { validarCapacidad } from "../utils/validarCapacidad";

interface ArgsUseReservaValidator {
  espacio: EspacioDTO | null;
  bloquesOcupados: BloqueFecha[];
  maxCapacidad: number;
  notify: NotificacionContextType["agregarNotificacion"];
}

export function useReservaValidator({
  espacio,
  bloquesOcupados,
  maxCapacidad,
  notify,
}: ArgsUseReservaValidator) {
  const validar = useCallback(
    (data: ReservaFrontendType): boolean => {
      if (!espacio) {
        notify("Espacio no disponible.", "error");
        return false;
      }

      if (
        !validarFechasConBloques({
          data,
          espacio,
          bloquesOcupados,
          notify,
        })
      ) {
        return false;
      }

      if (
        !validarCapacidad({
          data,
          maxCapacidad,
          notify,
        })
      ) {
        return false;
      }

      return true;
    },
    [espacio, bloquesOcupados, maxCapacidad, notify]
  );

  return { validar };
}
