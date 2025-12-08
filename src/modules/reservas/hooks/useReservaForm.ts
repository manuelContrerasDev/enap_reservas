// =====================================================================
// useReservaForm.ts — Hook maestro del flujo ENAP
// =====================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ymdLocal, parseYmdLocal } from "@/lib";

import { useAuth } from "@/context/auth";

import { useReserva } from "@/context/ReservaContext";
import type { CrearReservaPayload } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios, type Espacio } from "@/context/EspaciosContext";

import { calcularTotalReservaFrontend } from "@/utils/calcularTotalReservaFrontend";

import {
  reservaFrontendSchema,
  type ReservaFrontendType,
} from "@/validators/reserva.schema";

import { PATHS } from "@/routes/paths";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ------------------------------------------------------------

interface BloqueFecha {
  fechaInicio: string;
  fechaFin: string;
}

const FORM_KEY = "reservaDraftEnap";

const isMonday = (d: Date) => d.getDay() === 1;

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
  // RHF — Formulario
  // ============================================================

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservaFrontendType>({
    // 👉 cuando ya tengas 100% alineado el schema frontend/backend,
    //    descomenta el resolver:
    resolver: zodResolver(reservaFrontendSchema),
    defaultValues: {
      usoReserva: "USO_PERSONAL",
      socioPresente: true,

      /* Personas */
      cantidadPersonas: 1,
      cantidadPersonasPiscina: 0,

      /* Datos socio */
      nombreSocio: "",
      rutSocio: "",
      telefonoSocio: "",
      correoEnap: "",
      correoPersonal: null,

      /* Fechas */
      fechaInicio: "",
      fechaFin: "",

      /* Responsable (si socioPresente = false) */
      nombreResponsable: "",
      rutResponsable: "",
      emailResponsable: "",

      /* Invitados */
      invitados: [],
      // terminosAceptados lo controla el form de términos
    },
  });

  // ============================================================
  // Campos reactivos
  // ============================================================

  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");
  const personas = Number(watch("cantidadPersonas") ?? 1);
  const personasPiscina = Number(watch("cantidadPersonasPiscina") ?? 0);

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

      // limpiamos cualquier draft previo
      localStorage.removeItem(FORM_KEY);

      setLoading(true);
      setError(null);

      const [data, disponibilidad] = await Promise.all([
        obtenerEspacio(id),
        obtenerDisponibilidad(id),
      ]);

      if (!data) {
        setError("Espacio no encontrado");
        setEspacio(null);
        setBloquesOcupados([]);
        return;
      }

      setEspacio(data);
      setBloquesOcupados(disponibilidad ?? []);

      setReservaActual({
        espacioId: data.id,
        espacioNombre: data.nombre,
      });

      setValue("espacioId", data.id);
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
  // Prefill socio desde Auth
  // ============================================================

  useEffect(() => {
    if (!user) return;

    setValue("nombreSocio", user.name ?? "");
    setValue("correoEnap", user.email ?? "");
    setValue("correoPersonal", user.email ?? "");

    if ((user as any).rut) setValue("rutSocio", (user as any).rut);
    if ((user as any).telefono)
      setValue("telefonoSocio", (user as any).telefono);
  }, [user, setValue]);

  // ============================================================
  // Cálculo total ENAP — DESGLOSE COMPLETO (SINCRONIZADO BACKEND)
  // ============================================================

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

    const ini = parseYmdLocal(fechaInicio);
    const fin = parseYmdLocal(fechaFin);

    if (!(ini instanceof Date) || !(fin instanceof Date) || fin <= ini) {
      return {
        dias: 0,
        valorEspacio: 0,
        pagoPersonas: 0,
        pagoPiscina: 0,
        total: 0,
      };
    }

    const diffMs = fin.getTime() - ini.getTime();
    const d = Math.ceil(diffMs / 86400000);
    if (d <= 0) {
      return {
        dias: 0,
        valorEspacio: 0,
        pagoPersonas: 0,
        pagoPiscina: 0,
        total: 0,
      };
    }

    const dataForm = watch(); // ReservaFrontendType

    const { total, base, totalInvitados, totalPiscina } =
      calcularTotalReservaFrontend({
        espacio: {
          tipo: espacio.tipo as any,
          tarifaClp: espacio.tarifaClp,
          tarifaExterno: espacio.tarifaExterno,
        },
        dias: d,
        data: {
          usoReserva: dataForm.usoReserva,
          invitados: dataForm.invitados ?? [],
          cantidadPersonasPiscina: dataForm.cantidadPersonasPiscina ?? 0,
        },
      });

    return {
      dias: d,
      valorEspacio: base,
      pagoPersonas: totalInvitados,
      pagoPiscina: totalPiscina,
      total,
    };
  }, [espacio, fechaInicio, fechaFin, watch]);

  // ============================================================
  // Sync ReservaContext (solo para UI / preview)
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
      cantidadPersonas: personas,
      dias,
      total,
    });
  }, [espacio, fechaInicio, fechaFin, personas, dias, total, setReservaActual]);

  // ============================================================
  // Capacidad máxima (sincronizada con backend)
  // ============================================================

  const maxCap = useMemo(() => {
    if (!espacio) return 1;

    // Para piscina usamos la capacidad del espacio (o 100 como fallback),
    // igual que el backend.
    if (espacio.tipo === "PISCINA") {
      return espacio.capacidad ?? 100;
    }

    return (espacio.capacidad ?? 1) + (espacio.capacidadExtra ?? 0);
  }, [espacio]);

  // ============================================================
  // Validaciones de FECHAS + BLOQUES (alineadas con backend)
  // ============================================================

  const validarFechasConBloques = (data: ReservaFrontendType): boolean => {
    if (!data.fechaInicio || !data.fechaFin) {
      agregarNotificacion(
        "Debes seleccionar fecha de inicio y término.",
        "error"
      );
      return false;
    }

    const ini = parseYmdLocal(data.fechaInicio);
    const fin = parseYmdLocal(data.fechaFin);

    if (!(ini instanceof Date) || !(fin instanceof Date)) {
      agregarNotificacion("Fechas inválidas.", "error");
      return false;
    }

    // ❗ Regla oficial: NO puede INICIAR lunes, pero sí puede TERMINAR lunes
    if (isMonday(ini)) {
      agregarNotificacion(
        "No puedes iniciar una reserva en día lunes.",
        "error"
      );
      return false;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (ini < hoy) {
      agregarNotificacion("No puedes reservar en una fecha pasada.", "error");
      return false;
    }

    if (fin <= ini) {
      agregarNotificacion(
        "La fecha de término debe ser posterior a la de inicio.",
        "error"
      );
      return false;
    }

    const diffMs = fin.getTime() - ini.getTime();
    const d = Math.ceil(diffMs / 86400000);

    // Min / max días solo para CAB/QUINCHO
    if (espacio && espacio.tipo !== "PISCINA") {
      if (d < 3 || d > 6) {
        agregarNotificacion(
          "Las reservas deben tener mínimo 3 y máximo 6 días.",
          "error"
        );
        return false;
      }
    }

    // Conflicto con bloques ocupados (no aplica cupos de piscina, eso lo valida backend)
    const solapa = bloquesOcupados.some((b) => {
      const iniO = new Date(b.fechaInicio);
      const finO = new Date(b.fechaFin);
      return ini <= finO && fin >= iniO;
    });

    if (solapa) {
      agregarNotificacion(
        "El espacio ya está reservado en ese rango de fechas.",
        "error"
      );
      return false;
    }

    return true;
  };

  const validarCapacidad = (data: ReservaFrontendType): boolean => {
    const cant = data.cantidadPersonas ?? 1;

    if (cant > maxCap) {
      agregarNotificacion(
        `La cantidad de personas (${cant}) supera el máximo permitido (${maxCap}).`,
        "error"
      );
      return false;
    }

    return true;
  };

  // ============================================================
  // Submit final
  // ============================================================

  const onSubmit = async (data: ReservaFrontendType) => {
    if (!espacio) {
      agregarNotificacion("Espacio no disponible.", "error");
      return;
    }

    if (!validarFechasConBloques(data)) return;
    if (!validarCapacidad(data)) return;

    const payload: CrearReservaPayload = {
      espacioId: espacio.id,

      fechaInicio: data.fechaInicio,
      fechaFin: data.fechaFin,

      nombreSocio: data.nombreSocio,
      rutSocio: data.rutSocio,
      telefonoSocio: data.telefonoSocio,
      correoEnap: data.correoEnap,

      correoPersonal:
        data.correoPersonal && data.correoPersonal.trim() !== ""
          ? data.correoPersonal.trim()
          : undefined,

      usoReserva: data.usoReserva,
      socioPresente: data.socioPresente,

      nombreResponsable: data.socioPresente
        ? undefined
        : data.nombreResponsable || undefined,

      rutResponsable: data.socioPresente
        ? undefined
        : data.rutResponsable || undefined,

      emailResponsable: data.socioPresente
        ? undefined
        : data.emailResponsable || undefined,

      cantidadPersonas: data.cantidadPersonas,
      cantidadPersonasPiscina:
        data.cantidadPersonasPiscina !== undefined
          ? data.cantidadPersonasPiscina
          : 0,

      terminosAceptados: data.terminosAceptados === true,

      invitados: data.invitados?.map((i) => ({
        nombre: i.nombre,
        rut: i.rut,
        edad: i.edad,
      })),
    };


    const reservaId = await crearReservaEnServidor(payload);
    if (!reservaId) return;

    agregarNotificacion("Reserva creada correctamente", "success");

    navigate(`${PATHS.RESERVA_PREVIEW}?reservaId=${reservaId}`);
  };

  // ============================================================
  // Auto-save localStorage
  // ============================================================

  useEffect(() => {
    const sub = watch((value) => {
      localStorage.setItem(FORM_KEY, JSON.stringify(value));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  // ============================================================
  // Return Final API
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
    personas,
    personasPiscina,

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
