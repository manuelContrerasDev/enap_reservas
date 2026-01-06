// =====================================================================
// useReservaForm.ts — Hook maestro del flujo ENAP (FINAL / SYNC)
// =====================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ymdLocal } from "@/lib";

import { useAuth } from "@/context/auth";
import { useReserva } from "@/context/ReservaContext";
import type { CrearReservaPayload } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios } from "@/context/EspaciosContext";

import type { EspacioDTO } from "@/types/espacios";

import {
  reservaFrontendSchema,
  type ReservaFrontendType as ReservaFormData,
  type ReservaFrontendParsed,
} from "@/validators/reserva.schema";

import { PATHS } from "@/routes/paths";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsoReserva } from "@/types/enums";

import { fetchEspacioCompleto } from "@/modules/reservas/services/fetchEspacio";
import { calcularCapacidad } from "@/modules/reservas/utils/calcularCapacidad";
import {
  calcularTotalesReserva,
  type ReservaCalculoInput,
} from "@/modules/reservas/utils/calcularPrecio";
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

  const [espacio, setEspacio] = useState<EspacioDTO | null>(null);
  const [bloquesOcupados, setBloquesOcupados] = useState<BloqueFecha[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => ymdLocal(new Date()), []);

  // ============================================================
  // React Hook Form
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
  // Cargar espacio
  // ============================================================

  const fetchEspacio = useCallback(async () => {
    if (!id) {
      setError("Espacio no encontrado");
      setLoading(false);
      return;
    }

    try {
      localStorage.removeItem(FORM_KEY_RESERVA);
      setLoading(true);
      setError(null);

      const { espacio, bloquesOcupados } = await fetchEspacioCompleto(id, {
        obtenerEspacio,
        obtenerDisponibilidad,
      });

      if (!espacio) {
        setError("Espacio no encontrado");
        setEspacio(null);
        setBloquesOcupados([]);
        return;
      }

      setEspacio(espacio);
      setBloquesOcupados(bloquesOcupados);

      setReservaActual({
        espacioId: espacio.id,
        espacioNombre: espacio.nombre,
      });

      setValue("espacioId", espacio.id, { shouldValidate: true });
    } catch (e) {
      console.error(e);
      setError("Error al cargar el espacio");
      setEspacio(null);
      setBloquesOcupados([]);
    } finally {
      setLoading(false);
    }
  }, [id, obtenerEspacio, obtenerDisponibilidad, setReservaActual, setValue]);

  useEffect(() => {
    fetchEspacio();
  }, [fetchEspacio]);

  // ============================================================
  // Prefill socio
  // ============================================================

  useEffect(() => {
    if (!user) return;

    setValue("nombreSocio", user.name ?? "", { shouldValidate: true });
    setValue("correoEnap", user.email ?? "", { shouldValidate: true });
    setValue("correoPersonal", user.email ?? null, { shouldValidate: true });

    if ((user as any).rut) setValue("rutSocio", (user as any).rut);
    if ((user as any).telefono) setValue("telefonoSocio", (user as any).telefono);
  }, [user, setValue]);

  // ============================================================
  // Capacidad
  // ============================================================

  const maxCap = useMemo(() => calcularCapacidad(espacio), [espacio]);

  // ============================================================
  // Cálculo total (inputs SIEMPRE definidos)
  // ============================================================

  const calculoInput: ReservaCalculoInput = {
    usoReserva: watch("usoReserva"),
    cantidadPersonas: watch("cantidadPersonas"),
    cantidadPersonasPiscina: watch("cantidadPersonasPiscina") ?? 0, // ✅ FIX
    invitados: (watch("invitados") ?? []).map((i) => ({
      nombre: i.nombre,
      rut: i.rut,
      edad: i.edad,
      esPiscina: i.esPiscina ?? false,
    })),
  };

  const { dias, valorEspacio, pagoPersonas, pagoPiscina, total } = useMemo(() => {
    if (!espacio || !fechaInicio || !fechaFin) {
      return { dias: 0, valorEspacio: 0, pagoPersonas: 0, pagoPiscina: 0, total: 0 };
    }

    return calcularTotalesReserva({
      espacio,
      fechaInicio,
      fechaFin,
      data: calculoInput,
    });
  }, [espacio, fechaInicio, fechaFin, calculoInput]);

  // ============================================================
  // Sync contexto (mantiene draft incluso sin fechas)
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
      cantidadPersonas: calculoInput.cantidadPersonas,
      dias,
      total,
    });
  }, [espacio, fechaInicio, fechaFin, dias, total, setReservaActual, calculoInput]);

  // ============================================================
  // Validación negocio
  // ============================================================

  const { validar } = useReservaValidator({
    espacio,
    bloquesOcupados,
    maxCapacidad: maxCap,
    notify: agregarNotificacion,
  });

  // ============================================================
  // Submit (parse + fechas ISO + map payload backend)
  // ============================================================

  const onSubmit = async (data: ReservaFormData) => {
    if (!espacio) return;

    if (!validar(data)) return;

    // 1️⃣ Validación frontend (shape correcto)
    const parsed: ReservaFrontendParsed = reservaFrontendSchema.parse(data);

    // 2️⃣ 🔥 CONVERSIÓN A ISO (FIX DEFINITIVO)
    const parsedConFechasISO: ReservaFrontendParsed = {
      ...parsed,
      fechaInicio: new Date(parsed.fechaInicio).toISOString(),
      fechaFin: new Date(parsed.fechaFin).toISOString(),
    };

    // 3️⃣ Map exacto al contrato backend
    const payload: CrearReservaPayload = mapCrearReservaPayload(
      parsedConFechasISO,
      espacio.id
    );

    // 4️⃣ Envío al backend
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
  // API
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
