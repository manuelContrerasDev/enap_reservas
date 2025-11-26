// =====================================================================
// useReservaForm.ts — Hook maestro del flujo de reservas ENAP
// Profesionalizado + Sincronizado con backend + Validaciones reales
// =====================================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ymdLocal, parseYmdLocal } from "@/lib";

import { useAuth } from "@/context/AuthContext";
import { useReserva } from "@/context/ReservaContext";
import { useNotificacion } from "@/context/NotificacionContext";
import { useEspacios, type Espacio } from "@/context/EspaciosContext";
import { TipoEspacio, useCalcularReserva } from "@/hooks/useCalcularReserva";


import {
  reservaFrontendSchema,
  type ReservaFrontendType,
} from "@/validators/reserva.schema";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ============================================================
// Tipos auxiliares
// ============================================================
interface BloqueFecha {
  fechaInicio: string;
  fechaFin: string;
}

const FORM_KEY = "reservaDraftEnap";

// ============================================================
// Hook principal
// ============================================================
export function useReservaForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { setReservaActual, crearReservaEnServidor } = useReserva();
  const { agregarNotificacion } = useNotificacion();

  const { obtenerEspacio, obtenerDisponibilidad } = useEspacios();
  const { calcular } = useCalcularReserva();

  const [espacio, setEspacio] = useState<Espacio | null>(null);
  const [bloquesOcupados, setBloquesOcupados] = useState<BloqueFecha[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const today = useMemo(() => ymdLocal(new Date()), []);

  // ============================================================
  // RHF + ZOD
  // ============================================================
  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ReservaFrontendType>({
    resolver: zodResolver(reservaFrontendSchema),
    defaultValues: {
      usoReserva: "USO_PERSONAL",
      socioPresente: true,
      cantidadPersonas: 1,
      correoPersonal: "",
      terminosAceptados: false,

      nombreSocio: "",
      rutSocio: "",
      telefonoSocio: "",
    },
  });

  // Campos reactivos
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");
  const personas = Number(watch("cantidadPersonas") ?? 1);
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

      // sincronizar contexto reserva
      setReservaActual({
        espacioId: data.id,
        espacioNombre: data.nombre,
        tarifa: data.tarifaClp,
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
  // Prefill datos del socio autenticado
  // ============================================================
  useEffect(() => {
    if (!user) return;

    setValue("nombreSocio", user.name ?? "");
    setValue("correoEnap", user.email ?? "");
    setValue("correoPersonal", user.email ?? "");

    // en caso de tener rut / telefono en perfil
    if ((user as any).rut) setValue("rutSocio", (user as any).rut);
    if ((user as any).telefono) setValue("telefonoSocio", (user as any).telefono);
  }, [user, setValue]);

  // ============================================================
  // Cálculo total
  // ============================================================
  const { dias, total } = useMemo(() => {
    if (!espacio || !fechaInicio || !fechaFin) {
      return { dias: 0, total: 0 };
    }

    const ini = parseYmdLocal(fechaInicio);
    const fin = parseYmdLocal(fechaFin);

    if (!(ini instanceof Date) || !(fin instanceof Date)) {
      return { dias: 0, total: 0 };
    }
    if (fin < ini) {
      return { dias: 0, total: 0 };
    }

    const diffMs = fin.getTime() - ini.getTime();
    const d = Math.max(1, Math.ceil(diffMs / 86400000)); // ✔ AQUI se genera

    const totalCalculado = calcular({
      tipo: espacio.tipo as TipoEspacio,
      dias: d,                                    // ✔ USAR d AQUÍ
      personas,
      capacidadBase: espacio.capacidad,
      capacidadExtra: espacio.capacidadExtra ?? undefined,
      tarifaBaseSocio: espacio.tarifaClp,
      tarifaBaseTercero: espacio.tarifaExterno ?? undefined,
      extraSocio: espacio.extraSocioPorPersona ?? undefined,
      extraTercero: espacio.extraTerceroPorPersona ?? undefined,
      usoReserva,
    });

    return { dias: d, total: totalCalculado };
  }, [espacio, fechaInicio, fechaFin, personas, usoReserva, calcular]);

    // ============================================================
    // Sincronizar con ReservaContext (side-effect en useEffect)
    // ============================================================
 // ============================================================
    // Sincronizar con ReservaContext (sin borrar el cálculo)
    // ============================================================
    useEffect(() => {
      if (!espacio) return;

      // Si aún no ingresaron fechas → solo guardamos metadatos del espacio
      if (!fechaInicio || !fechaFin) {
        setReservaActual({
          espacioId: espacio.id,
          espacioNombre: espacio.nombre,
          tarifa: espacio.tarifaClp,
        });
        return;
      }

      // Cuando ya existen fechas → guardamos el cálculo correcto SIEMPRE
      setReservaActual({
        espacioId: espacio.id,
        espacioNombre: espacio.nombre,
        tarifa: espacio.tarifaClp,
        fechaInicio,
        fechaFin,
        personas: Number(personas) || 1,
        dias,
        total,
      });
    }, [
      espacio,
      fechaInicio,
      fechaFin,
      personas,
      dias,
      total,
      setReservaActual,
    ]);


    const maxCap =
      (espacio?.capacidad ?? 1) + (espacio?.capacidadExtra ?? 0);

  // ============================================================
  // Validaciones de fechas enap
  // ============================================================
  const validarFechasConBloques = (data: ReservaFrontendType): boolean => {
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

    // ❗ Fecha de inicio no puede ser pasada
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (ini < hoy) {
      agregarNotificacion("No puedes reservar en una fecha pasada.", "error");
      return false;
    }

    // ❗ Termino > inicio
    if (fin <= ini) {
      agregarNotificacion("La fecha de término debe ser posterior a la de inicio.", "error");
      return false;
    }

    // ❗ Solape con reservas ocupadas
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

        const payload = {
      ...data,
      dias,
      total,
    };

    const reservaId = await crearReservaEnServidor(payload as any);


    if (!reservaId) return;

    agregarNotificacion("Reserva creada correctamente", "success");
    navigate(`/reserva/preview?reservaId=${reservaId}`);
  };

  useEffect(() => {
      const saved = localStorage.getItem(FORM_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          Object.entries(data).forEach(([key, value]) => {
            setValue(key as any, value);
          });
        } catch (err) {
          console.error("Error leyendo draft reserva:", err);
        }
      }
    }, [setValue]);

    useEffect(() => {
    const sub = watch((value) => {
      localStorage.setItem(FORM_KEY, JSON.stringify(value));
    });
    return () => sub.unsubscribe();
  }, [watch]);



  // ============================================================
  // RETORNO FINAL AL COMPONENTE
  // ============================================================
  return {
    loading,
    error,
    espacio,

    // RHF
    register,
    watch,
    setValue,
    errors,
    handleSubmit,

    // reactivos
    fechaInicio,
    fechaFin,
    personas,
    usoReserva,
    socioPresente,
    responsable,

    // helpers
    total,
    maxCap,
    today,

    // handlers
    onChangeInicio: (v: string) =>
      setValue("fechaInicio", v, { shouldValidate: true }),

    onChangeFin: (v: string) =>
      setValue("fechaFin", v, { shouldValidate: true }),

    onChangePersonas: (v: number) =>
      setValue("cantidadPersonas", v, { shouldValidate: true }),

    setResponsable: (r: { nombre: string; rut: string; email: string }) => {
      setValue("nombreResponsable", r.nombre);
      setValue("rutResponsable", r.rut);
      setValue("emailResponsable", r.email);
    },

    // submit
    onSubmit,
  };
}
