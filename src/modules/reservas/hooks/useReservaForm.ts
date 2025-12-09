// =====================================================================
// useReservaForm.ts — Hook maestro del flujo ENAP (versión corregida)
// =====================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ymdLocal } from "@/lib";

import { useAuth } from "@/context/auth";
import { useReserva } from "@/context/ReservaContext";
import type { CrearReservaPayload } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios, type Espacio } from "@/context/EspaciosContext";

import { reservaFrontendSchema } from "@/validators/reserva.schema";
import type { ReservaFrontendType as ReservaFormData } from "@/validators/reserva.schema";

import { PATHS } from "@/routes/paths";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { fetchEspacioCompleto } from "@/modules/reservas/services/fetchEspacio";
import { calcularCapacidad } from "@/modules/reservas/utils/calcularCapacidad";
import { calcularTotalesReserva } from "@/modules/reservas/utils/calcularPrecio";
import { mapCrearReservaPayload } from "@/modules/reservas/utils/mapPayload";

import {
  setupAutoSaveReservaForm,
  FORM_KEY_RESERVA,
} from "@/modules/reservas/storage/autoSaveReserva";

import type { BloqueFecha } from "@/modules/reservas/utils/validarFechas";
import { useReservaValidator } from "@/modules/reservas/hooks/useReservaValidator";

// ------------------------------------------------------------

export function useReservaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { setReservaActual, crearReservaEnServidor } = useReserva();
  const { agregarNotificacion } = useNotificacion();
  const { obtenerEspacio, obtenerDisponibilidad } = useEspacios();

  const [espacio, setEspacio] = useState<Espacio | null>(null);
  const [bloquesOcupados, setBloquesOcupados] = useState<BloqueFecha[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => ymdLocal(new Date()), []);

  // ============================================================
  // RHF — Formulario (CORREGIDO)
  // ============================================================

  const form = useForm<ReservaFormData>({
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

      usoReserva: "USO_PERSONAL",
      socioPresente: true,

      nombreResponsable: null,
      rutResponsable: null,
      emailResponsable: null,

      invitados: [],

      terminosAceptados: false,
      terminosVersion: null,
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");

  // ============================================================
  // Cargar espacio + disponibilidad
  // ============================================================

  const fetchEspacio = useCallback(async () => {
    try {
      if (!id) {
        setError("Espacio no encontrado");
        setLoading(false);
        return;
      }

      localStorage.removeItem(FORM_KEY_RESERVA);

      setLoading(true);
      setError(null);

      const { espacio: data, bloquesOcupados } = await fetchEspacioCompleto(
        id,
        { obtenerEspacio, obtenerDisponibilidad }
      );

      if (!data) {
        setError("Espacio no encontrado");
        setEspacio(null);
        setBloquesOcupados([]);
        return;
      }

      setEspacio(data);
      setBloquesOcupados(bloquesOcupados);

      setReservaActual({
        espacioId: data.id,
        espacioNombre: data.nombre,
      });

      setValue("espacioId", data.id);
    } catch (e) {
      console.error(e);
      setError("Error al cargar el espacio");
    } finally {
      setLoading(false);
    }
  }, [id, obtenerEspacio, obtenerDisponibilidad, setReservaActual, setValue]);

  useEffect(() => {
    fetchEspacio();
  }, [fetchEspacio]);

  // ============================================================
  // Prefill socio desde Auth
  // ============================================================

  useEffect(() => {
    if (!user) return;

    setValue("nombreSocio", user.name ?? "");
    setValue("correoEnap", user.email ?? "");
    setValue("correoPersonal", user.email ?? "");

    if ((user as any).rut) setValue("rutSocio", (user as any).rut);
    if ((user as any).telefono) setValue("telefonoSocio", (user as any).telefono);
  }, [user, setValue]);

  // ============================================================
  // Capacidad máxima
  // ============================================================

  const maxCap = useMemo(() => calcularCapacidad(espacio), [espacio]);

  // ============================================================
  // Cálculo total — totalmente reactivo
  // ============================================================

  const usoReserva = watch("usoReserva");
  const cantidadPersonas = watch("cantidadPersonas");
  const cantidadPersonasPiscina = watch("cantidadPersonasPiscina");
  const invitados = watch("invitados");

  const { dias, valorEspacio, pagoPersonas, pagoPiscina, total } = useMemo(() => {
    if (!espacio || !fechaInicio || !fechaFin) {
      return {
        dias: 0,
        valorEspacio: 0,
        pagoPersonas: 0,
        pagoPiscina: 0,
        total: 0,
      };
    }

    return calcularTotalesReserva({
      espacio,
      fechaInicio,
      fechaFin,
      data: {
        usoReserva,
        cantidadPersonas,
        cantidadPersonasPiscina,
        invitados,
      } as ReservaFormData,
    });
  }, [
    espacio,
    fechaInicio,
    fechaFin,
    usoReserva,
    cantidadPersonas,
    cantidadPersonasPiscina,
    invitados,
  ]);

  // ============================================================
  // Sync ReservaContext
  // ============================================================

  useEffect(() => {
    if (!espacio) return;

    if (!fechaInicio || !fechaFin) {
      setReservaActual({
        espacioId: espacio.id,
        espacioNombre: espacio.nombre,
      });
      return;
    }

    setReservaActual({
      espacioId: espacio.id,
      espacioNombre: espacio.nombre,
      fechaInicio,
      fechaFin,
      cantidadPersonas,
      dias,
      total,
    });
  }, [espacio, fechaInicio, fechaFin, cantidadPersonas, dias, total, setReservaActual]);

  // ============================================================
  // Validaciones ENAP
  // ============================================================

  const { validar } = useReservaValidator({
    espacio,
    bloquesOcupados,
    maxCapacidad: maxCap,
    notify: agregarNotificacion,
  });

  // ============================================================
  // Submit final
  // ============================================================

  const onSubmit = async (data: ReservaFormData) => {
    if (!espacio) {
      agregarNotificacion("Espacio no disponible.", "error");
      return;
    }

    const esValida = validar(data);
    if (!esValida) return;

    const payload: CrearReservaPayload = mapCrearReservaPayload(data, espacio);

    const reservaId = await crearReservaEnServidor(payload);
    if (!reservaId) return;

    agregarNotificacion("Reserva creada correctamente", "success");
    navigate(`${PATHS.RESERVA_PREVIEW}?reservaId=${reservaId}`);
  };

  // ============================================================
  // Autosave
  // ============================================================

  useEffect(() => {
    const cleanup = setupAutoSaveReservaForm(watch, FORM_KEY_RESERVA);
    return cleanup;
  }, [watch]);

  // ============================================================
  // Return
  // ============================================================

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
