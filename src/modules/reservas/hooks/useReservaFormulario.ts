// ============================================================
// useReservaFormulario.ts — RHF + schema
// ============================================================

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  reservaFrontendSchema,
  type ReservaFrontendType,
} from "@/modules/reservas/schemas/reserva.schema";

import { UsoReserva } from "@/shared/types/enums";

export function useReservaFormulario() {
  const form = useForm<ReservaFrontendType>({
    resolver: zodResolver(reservaFrontendSchema),
    mode: "onChange",
    defaultValues: {
      espacioId: "",
      fechaInicio: "",
      fechaFin: "",

      cantidadPersonas: 1,
      cantidadPersonasPiscina: 0,

      nombreSocio: "",
      rutSocio: "",
      telefonoSocio: "",
      correoEnap: "",
      correoPersonal: null,

      usoReserva: UsoReserva.USO_PERSONAL,
      socioPresente: true,

      nombreResponsable: null,
      rutResponsable: null,
      emailResponsable: null,

      invitados: [],

      terminosAceptados: false,
      terminosVersion: null,
    },
  });

  return form;
}

