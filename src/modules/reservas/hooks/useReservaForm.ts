// ============================================================
// useReservaForm.ts — Wrapper limpio (PRODUCTION)
// ============================================================

import { useMemo } from "react";
import { ymdLocal } from "@/shared/lib";

import { useReservaEspacio } from "./useReservaEspacio";
import { useReservaFormulario } from "./useReservaFormulario";
import { useReservaCalculo } from "./useReservaCalculo";
import { useReservaDraft } from "./useReservaDraft";
import { useReservaSubmit } from "./useReservaSubmit";
import { useReservaAutosave } from "./useReservaAutosave";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";

import { calcularCapacidad } from "@/modules/reservas/utils/calcularCapacidad";
import { useReservaValidator } from "@/modules/reservas/hooks/useReservaValidator";

export function useReservaForm() {
  const today = useMemo(() => ymdLocal(new Date()), []);
  const { agregarNotificacion } = useNotificacion();

  /* ============================================================
   * 1️⃣ Espacio + disponibilidad
   * ============================================================ */
  const {
    espacio,
    bloquesOcupados,
    error,
    isLoading: isPageLoading,
  } = useReservaEspacio();

  /* ============================================================
   * 2️⃣ Formulario RHF
   * ============================================================ */
  const form = useReservaFormulario();
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  /* ============================================================
   * 3️⃣ Valores observados
   * ============================================================ */
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");
  const usoReserva = watch("usoReserva");
  const cantidadPersonas = watch("cantidadPersonas");
  const invitados = watch("invitados") ?? [];

  /* ============================================================
   * 4️⃣ Capacidad máxima (según espacio + rol)
   * ============================================================ */
  const maxCap = useMemo(
    () => calcularCapacidad(espacio),
    [espacio]
  );

  /* ============================================================
   * 5️⃣ Input de cálculo (ÚNICA FUENTE, NORMALIZADA)
   * ============================================================ */
  const calculoInput = useMemo(
    () => ({
      usoReserva,
      cantidadPersonas: cantidadPersonas ?? 0,
      invitados: invitados.map((i: any) => ({
        nombre: i.nombre,
        rut: i.rut,
        edad: i.edad,
        esPiscina: Boolean(i.esPiscina),
      })),
    }),
    [usoReserva, cantidadPersonas, invitados]
  );

  const {
    dias,
    valorEspacio,
    pagoPersonas,
    pagoPiscina,
    total,
  } = useReservaCalculo(
    espacio,
    fechaInicio,
    fechaFin,
    calculoInput
  );

  /* ============================================================
   * 6️⃣ Draft (recuperación y continuidad)
   * ============================================================ */
  useReservaDraft({
    espacio,
    fechaInicio,
    fechaFin,
    dias,
    total,
    cantidadPersonas: cantidadPersonas ?? 0,
  });

  /* ============================================================
   * 7️⃣ Validación de negocio (frontend)
   * ============================================================ */
  const { validar } = useReservaValidator({
    espacio,
    bloquesOcupados,
    maxCapacidad: maxCap,
    notify: agregarNotificacion,
  });

  /* ============================================================
   * 8️⃣ Submit
   * ============================================================ */
  const { onSubmit, isSubmitting } = useReservaSubmit(
    espacio,
    validar
  );

  /* ============================================================
   * 9️⃣ Autosave
   * ============================================================ */
  useReservaAutosave(watch);

  const loading = isPageLoading || isSubmitting;

  return {
    loading,
    error,
    espacio,
    bloquesOcupados,

    register,
    watch,
    setValue,
    errors,
    handleSubmit,

    fechaInicio,
    fechaFin,

    dias,
    valorEspacio,
    pagoPersonas,
    pagoPiscina,
    total,

    maxCap,
    today,

    onSubmit,
  };
}
