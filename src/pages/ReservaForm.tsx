import React, { useState, useEffect, useCallback, FormEvent, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DollarSign, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { supabase, Espacio } from "../lib/supabase";
import { useReserva } from "../context/ReservaContext";
import { useNotificacion } from "../context/NotificacionContext";
import { ymdLocal, parseYmdLocal } from "@/lib/date";
import { clp } from "@/lib/format";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

const ReservaForm: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservaActual, setReservaActual } = useReserva();
  const { agregarNotificacion } = useNotificacion();

  const [espacio, setEspacio] = useState<Espacio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Inputs controlados
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [personas, setPersonas] = useState<number>(1);

  // Fechas mínimas
  const today = useMemo(() => ymdLocal(new Date()), []);
  const endMin = useMemo(() => (fechaInicio ? fechaInicio : today), [fechaInicio, today]);

  const fetchEspacio = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("espacios")
        .select("id,nombre,tipo,tarifa,capacidad,descripcion,imagen,activo,created_at")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError("Espacio no encontrado");
        agregarNotificacion("Espacio no encontrado", "error");
        return;
      }

      const espacioFull: Espacio = {
        id: data.id,
        nombre: data.nombre,
        tipo: data.tipo,
        tarifa: data.tarifa ?? 0,
        capacidad: data.capacidad ?? 1,
        descripcion: data.descripcion ?? "",
        imagen: data.imagen ?? "",
        activo: data.activo ?? true,
        created_at: data.created_at ?? new Date().toISOString(),
      };
      setEspacio(espacioFull);

      setReservaActual({
        espacioId: data.id,
        espacioNombre: data.nombre,
        tarifa: espacioFull.tarifa,
      });
    } catch (err) {
      console.error("❌ Error al cargar espacio:", err);
      setError("No se pudo cargar el espacio. Intenta nuevamente.");
      agregarNotificacion("Error al cargar el espacio", "error");
    } finally {
      setLoading(false);
    }
  }, [id, agregarNotificacion, setReservaActual]);

  useEffect(() => {
    fetchEspacio();
  }, [fetchEspacio]);

  // Sincroniza formulario → contexto (para total en vivo)
  useEffect(() => {
    if (!espacio) return;
    setReservaActual({
      fechaInicio,
      fechaFin,
      personas,
      tarifa: espacio.tarifa,
      espacioId: espacio.id,
      espacioNombre: espacio.nombre,
    });
  }, [fechaInicio, fechaFin, personas, espacio, setReservaActual]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!espacio) return;

    if (!fechaInicio || !fechaFin) {
      agregarNotificacion("Completa las fechas antes de continuar.", "error");
      return;
    }

    const ini = parseYmdLocal(fechaInicio)!;
    const fin = parseYmdLocal(fechaFin)!;
    if (fin < ini) {
      agregarNotificacion("La fecha de fin no puede ser anterior al inicio.", "error");
      return;
    }

    const maxCap = espacio.capacidad ?? Infinity;
    if (personas < 1 || personas > maxCap) {
      agregarNotificacion(`Cantidad de personas inválida. Capacidad máxima: ${espacio.capacidad ?? 1}.`, "error");
      return;
    }

    if (!reservaActual || reservaActual.total <= 0) {
      agregarNotificacion("Rango de fechas inválido. El total no puede ser 0.", "error");
      return;
    }

    agregarNotificacion("Reserva creada exitosamente", "success");
    navigate("/pago");
  };

  const onImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
  }, []);

  if (!id) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <AlertTriangle className="mb-4 text-[#DEC01F]" size={56} />
        <h2 className="mb-3 text-2xl font-bold text-[#002E3E]">Selecciona un espacio para continuar con tu reserva</h2>
        <Link
          to="/espacios"
          className="mt-3 rounded-lg bg-[#002E3E] px-6 py-3 text-white shadow-sm transition-colors hover:bg-[#003B4D]"
        >
          Ir a Espacios
        </Link>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#002E3E]">
        <Loader2 className="animate-spin" size={48} />
        <p className="mt-3 text-sm text-gray-600">Cargando información del espacio...</p>
      </div>
    );
  }

  if (error || !espacio) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="mb-4 text-red-500" size={48} />
        <h2 className="mb-2 text-2xl font-bold text-gray-800">{error || "Espacio no encontrado"}</h2>
        <Link
          to="/espacios"
          className="mt-4 rounded-lg bg-[#002E3E] px-6 py-3 text-white shadow-sm transition-colors hover:bg-[#003B4D]"
        >
          Volver a Espacios
        </Link>
      </section>
    );
  }

// ✅ sin hooks, no rompe el orden
const total = reservaActual?.total ?? 0;
const capOk = espacio?.capacidad ? personas <= espacio.capacidad : true;
const disabled = !fechaInicio || !fechaFin || total <= 0 || personas < 1 || !capOk;


  return (
    <main
      id="main-content"
      className="flex min-h-[calc(100vh-120px)] flex-col items-center bg-[#F9FAFB] px-6 py-12"
      aria-labelledby="reserva-title"
    >
      <div className="w-full max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/espacios")}
          className="mb-6 flex items-center gap-2 font-medium text-[#002E3E] transition-colors hover:text-[#003B4D]"
        >
          <ArrowLeft size={20} /> Volver a espacios
        </button>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Información del espacio */}
          <motion.article
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md"
            aria-labelledby="reserva-title"
          >
            <figure>
              <img
                src={espacio.imagen || FALLBACK_IMG}
                onError={onImageError}
                alt={`Espacio ${espacio.nombre}`}
                width={1280}
                height={720}
                className="h-64 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </figure>
            <div className="space-y-3 p-6">
              <h2 id="reserva-title" className="text-2xl font-bold text-[#002E3E]">
                {espacio.nombre}
              </h2>
              <p className="text-gray-600">
                {espacio.descripcion || "Espacio disponible para reserva en Refinería Aconcagua."}
              </p>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>Tipo: <strong>{espacio.tipo}</strong></li>
                <li>Capacidad: <strong>{espacio.capacidad ?? 1}</strong> personas</li>
                <li>Tarifa: <strong className="text-[#DEC01F]">{clp(espacio.tarifa)}/día</strong></li>
              </ul>
            </div>
          </motion.article>

          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
            className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-md"
            aria-describedby="form-ayuda"
            noValidate
          >
            <h3 className="text-2xl font-bold text-[#002E3E]">Datos de la Reserva</h3>
            <p id="form-ayuda" className="text-xs text-gray-500">
              Ingresa fechas y cantidad de personas para calcular el total automáticamente.
            </p>

            <fieldset className="space-y-4">
              <legend className="sr-only">Fechas de reserva</legend>

              <label htmlFor="ini" className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
              </label>
              <input
                id="ini"
                type="date"
                value={fechaInicio}
                onChange={(e) => {
                  const val = e.target.value;
                  setFechaInicio(val);
                  if (fechaFin && parseYmdLocal(fechaFin)! < parseYmdLocal(val)!) {
                    setFechaFin(val);
                  }
                }}
                min={today}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#002E3E]"
              />

              <label htmlFor="fin" className="block text-sm font-medium text-gray-700">
                Fecha de Fin
              </label>
              <input
                id="fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min={endMin}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#002E3E]"
              />
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="sr-only">Cantidad de personas</legend>
              <label htmlFor="personas" className="block text-sm font-medium text-gray-700">
                Cantidad de Personas
              </label>
              <input
                id="personas"
                type="number"
                inputMode="numeric"
                value={personas}
                onChange={(e) => setPersonas(Math.max(1, Number(e.target.value) || 1))}
                min={1}
                {...(espacio.capacidad ? ({ max: espacio.capacidad } as any) : {})}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-[#002E3E]"
              />
            </fieldset>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <span className="flex items-center gap-2 text-lg font-bold text-[#002E3E]">
                <DollarSign size={22} /> Total
              </span>
              {/* output semántico + aria-live para lectores de pantalla */}
              <output
                htmlFor="ini fin personas"
                aria-live="polite"
                className="text-xl font-bold text-[#DEC01F]"
              >
                {clp(total)}
              </output>
            </div>

            <motion.button
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              type="submit"
              disabled={disabled}
              className={`w-full rounded-lg py-4 font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DEC01F]/60 ${
                disabled
                  ? "cursor-not-allowed bg-gray-300 text-gray-600"
                  : "bg-[#002E3E] text-white hover:bg-[#003B4D]"
              }`}
            >
              Confirmar Reserva
            </motion.button>
          </motion.form>
        </div>
      </div>
    </main>
  );
};

export default ReservaForm;
