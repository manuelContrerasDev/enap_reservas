// =====================================================================
// useReservaForm.ts — Hook maestro del flujo ENAP (VERSIÓN TIPADA OK)
// =====================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ymdLocal, parseYmdLocal } from "@/lib";

import { useAuth } from "@/context/AuthContext";
import { useReserva } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios, type Espacio } from "@/context/EspaciosContext";

import {
  reservaFrontendSchema,
  type ReservaFrontendType,
} from "@/validators/reserva.schema";

import { PATHS } from "@/routes/paths";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ------------------------------------------------------------

interface BloqueFecha {
  fechaInicio: string;
  fechaFin: string;
}

const FORM_KEY = "reservaDraftEnap";

// 👉 Alias simple: el formulario ES el schema
type ReservaFormValues = ReservaFrontendType;

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
  // RHF
  // ============================================================

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaFrontendSchema),
    defaultValues: {
      usoReserva: "USO_PERSONAL",
      socioPresente: true,
      cantidadPersonas: 1,
      cantidadPersonasPiscina: 0,
      correoPersonal: "",
      terminosAceptados: false,

      nombreSocio: "",
      rutSocio: "",
      telefonoSocio: "",

      fechaInicio: "",
      fechaFin: "",
    },
  });

  // ============================================================
  // Campos reactivos
  // ============================================================

  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");

  const personas = Number(watch("cantidadPersonas") ?? 1);
  const personasPiscina = Number(watch("cantidadPersonasPiscina") ?? 0);

  const socioPresente = watch("socioPresente");
  const usoReserva = watch("usoReserva");

  const responsable = {
    nombre: watch("nombreResponsable") || "",
    rut: watch("rutResponsable") || "",
    email: watch("emailResponsable") || "",
  };

  // ============================================================
  // Fetch espacio + disponibilidad
  // ============================================================

  const fetchEspacio = useCallback(async () => {
    try {
      if (!id) {
        setError("Espacio no encontrado");
        setLoading(false);
        return;
      }

      // 🔄 Reset form al entrar a un espacio nuevo
      localStorage.removeItem(FORM_KEY);
      setValue("fechaInicio", "");
      setValue("fechaFin", "");
      setValue("cantidadPersonas", 1);
      setValue("cantidadPersonasPiscina", 0);

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
  // Prefill socio
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
  // Cálculo total (por ahora solo días; puedes ajustar lógica ENAP aquí)
  // ============================================================

  const { dias, total } = useMemo(() => {
    if (!espacio || !fechaInicio || !fechaFin)
      return { dias: 0, total: 0 };

    const ini = parseYmdLocal(fechaInicio);
    const fin = parseYmdLocal(fechaFin);

    if (!(ini instanceof Date) || !(fin instanceof Date))
      return { dias: 0, total: 0 };

    if (fin <= ini)
      return { dias: 0, total: 0 };

    const diffMs = fin.getTime() - ini.getTime();
    let d = Math.ceil(diffMs / 86400000);
    if (d <= 0) return { dias: 0, total: 0 };

    // 👉 aquí luego puedes sumar piscina/cabaña/quincho según reglas ENAP
    return { dias: d, total: 0 };
  }, [espacio, fechaInicio, fechaFin, personas, personasPiscina]);

  // ============================================================
  // Sync reservaContext
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
  // Capacidad máxima
  // ============================================================

  const maxCap = useMemo(() => {
    if (!espacio) return 1;
    if (espacio.tipo === "PISCINA") return 80;
    return (espacio.capacidad ?? 1) + (espacio.capacidadExtra ?? 0);
  }, [espacio]);

  // ============================================================
  // Validaciones
  // ============================================================

  const validarFechasConBloques = (data: ReservaFormValues): boolean => {
    if (!data.fechaInicio || !data.fechaFin) {
      agregarNotificacion("Debes seleccionar fecha de inicio y término.", "error");
      return false;
    }

    const ini = parseYmdLocal(data.fechaInicio);
    const fin = parseYmdLocal(data.fechaFin);

    if (!(ini instanceof Date) || !(fin instanceof Date)) {
      agregarNotificacion("Fechas inválidas.", "error");
      return false;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (ini < hoy) {
      agregarNotificacion("No puedes reservar en una fecha pasada.", "error");
      return false;
    }

    if (fin <= ini) {
      agregarNotificacion("La fecha de término debe ser posterior a la de inicio.", "error");
      return false;
    }

    // Regla ENAP: Quincho / Cabaña = entre 3 y 6 días
    const diffMs = fin.getTime() - ini.getTime();
    const d = Math.ceil(diffMs / 86400000);
    if (espacio && espacio.tipo !== "PISCINA") {
      if (d < 3 || d > 6) {
        agregarNotificacion(
          "Las reservas de cabañas y quinchos deben ser mínimo 3 y máximo 6 días.",
          "error"
        );
        return false;
      }
    }

    // Solape con bloques ocupados
    const solapa = bloquesOcupados.some((b) => {
      const iniO = new Date(b.fechaInicio);
      const finO = new Date(b.fechaFin);
      return ini <= finO && fin >= iniO;
    });

    if (solapa) {
      agregarNotificacion("El espacio ya está reservado en ese rango de fechas.", "error");
      return false;
    }

    return true;
  };

  const validarCapacidad = (data: ReservaFormValues): boolean => {
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
  // Submit final (tipado como SubmitHandler<ReservaFormValues>)
  // ============================================================

  const onSubmit: SubmitHandler<ReservaFormValues> = async (data) => {
    if (!espacio) {
      agregarNotificacion("Espacio no disponible.", "error");
      return;
    }

    if (!validarFechasConBloques(data)) return;
    if (!validarCapacidad(data)) return;

    const payload = {
      ...data,
      espacioId: espacio.id,
      dias,
      total,
    };

    const reservaId = await crearReservaEnServidor(payload as any);
    if (!reservaId) return;

    agregarNotificacion("Reserva creada correctamente", "success");

    navigate(`${PATHS.RESERVA_PREVIEW}?reservaId=${reservaId}`);
  };

  // ============================================================
  // Auto-save
  // ============================================================

  useEffect(() => {
    const sub = watch((value) => {
      localStorage.setItem(FORM_KEY, JSON.stringify(value));
    });
    return () => sub.unsubscribe();
  }, [watch]);

  // ============================================================
  // Return
  // ============================================================

  return {
    loading,
    error,
    espacio,

    register,
    watch,
    setValue,
    errors,
    handleSubmit,

    fechaInicio,
    fechaFin,
    personas,
    personasPiscina,
    usoReserva,
    socioPresente,
    responsable,

    total,
    maxCap,
    today,

    onChangeInicio: (v: string) =>
      setValue("fechaInicio", v, { shouldValidate: true }),

    onChangeFin: (v: string) =>
      setValue("fechaFin", v, { shouldValidate: true }),

    onChangePersonas: (v: number) =>
      setValue("cantidadPersonas", v, { shouldValidate: true }),

    onSubmit,
  };
}
