import React, { useState, useEffect, useCallback, FormEvent, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { DollarSign, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { supabase, Espacio } from "../lib/supabase";
import { useReserva } from "../context/ReservaContext";
import { useNotificacion } from "../context/NotificacionContext";

/** Utils */
const CLP = new Intl.NumberFormat("es-CL");
const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

const ymdLocal = (d = new Date()) => {
  // YYYY-MM-DD en local time (evita TZ issues)
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseLocal = (s?: string) => (s ? new Date(`${s}T00:00:00`) : null);

/** 🧾 Formulario de creación de reservas */
const ReservaForm: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservaActual, setReservaActual } = useReserva();
  const { agregarNotificacion } = useNotificacion();

  const [espacio, setEspacio] = useState<Espacio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado local de inputs (controlados)
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [personas, setPersonas] = useState<number>(1);

  /** Fechas mínimas calculadas */
  const today = useMemo(() => ymdLocal(new Date()), []);
  const endMin = useMemo(() => (fechaInicio ? fechaInicio : today), [fechaInicio, today]);

  const fetchEspacio = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("espacios")
        .select(
          "id,nombre,tipo,tarifa,capacidad,descripcion,imagen,activo,created_at"
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError("Espacio no encontrado");
        agregarNotificacion("Espacio no encontrado", "error");
        return;
      }

      // ✅ cumplir totalmente con el tipo Espacio
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
        tarifa: data.tarifa ?? 0,
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

  /** 📅 Sincronizar formulario con el contexto (recalcula total) */
  useEffect(() => {
    if (!espacio) return;
    setReservaActual({
      fechaInicio,
      fechaFin,
      personas,
      tarifa: espacio.tarifa, // refuerza tarifa actual
      espacioId: espacio.id,
      espacioNombre: espacio.nombre,
    });
  }, [fechaInicio, fechaFin, personas, espacio, setReservaActual]);

  /** 💾 Confirmar reserva */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!espacio) return;

    if (!fechaInicio || !fechaFin) {
      agregarNotificacion("Completa las fechas antes de continuar.", "error");
      return;
    }

    // Validar rango de fechas y capacidad
    const ini = parseLocal(fechaInicio)!;
    const fin = parseLocal(fechaFin)!;
    if (fin < ini) {
      agregarNotificacion("La fecha de fin no puede ser anterior al inicio.", "error");
      return;
    }

    const maxCap = espacio.capacidad ?? Infinity;
    if (personas < 1 || personas > maxCap) {
      agregarNotificacion(
        `Cantidad de personas inválida. Capacidad máxima: ${espacio.capacidad ?? 1}.`,
        "error"
      );
      return;
    }

    if (!reservaActual || reservaActual.total <= 0) {
      agregarNotificacion("Rango de fechas inválido. El total no puede ser 0.", "error");
      return;
    }

    agregarNotificacion("Reserva creada exitosamente", "success");
    navigate("/pago");
  };

  /** 🖼️ Imagen con fallback */
  const onImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
  }, []);

  /** 🚫 Sin ID → guía */
  if (!id) {
    return (
      <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <AlertTriangle className="text-[#DEC01F] mb-4" size={56} />
        <h2 className="text-2xl font-bold text-[#002E3E] mb-3">
          Selecciona un espacio para continuar con tu reserva
        </h2>
        <button
          onClick={() => navigate("/espacios")}
          className="mt-3 bg-[#002E3E] hover:bg-[#003B4D] text-white px-6 py-3 rounded-lg shadow-sm transition-colors"
        >
          Ir a Espacios
        </button>
      </section>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#002E3E]">
        <Loader2 className="animate-spin" size={48} />
        <p className="text-sm text-gray-600 mt-3">Cargando información del espacio...</p>
      </div>
    );
  }

  if (error || !espacio) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {error || "Espacio no encontrado"}
        </h2>
        <button
          onClick={() => navigate("/espacios")}
          className="mt-4 bg-[#002E3E] hover:bg-[#003B4D] text-white px-6 py-3 rounded-lg shadow-sm transition-colors"
        >
          Volver a Espacios
        </button>
      </section>
    );
  }

  const total = reservaActual?.total ?? 0;
  const disabled =
    !fechaInicio || !fechaFin || total <= 0 || personas < 1 || (espacio.capacidad ? personas > espacio.capacidad : false);

  return (
    <main
      className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-12 px-6 flex flex-col items-center"
      role="main"
      aria-labelledby="reserva-title"
    >
      <div className="max-w-7xl w-full">
        <button
          onClick={() => navigate("/espacios")}
          className="flex items-center gap-2 text-[#002E3E] hover:text-[#003B4D] mb-6 font-medium transition-colors"
        >
          <ArrowLeft size={20} /> Volver a espacios
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* 🏡 Información del espacio */}
          <motion.article
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: -20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
            aria-labelledby="reserva-title"
          >
            <img
              src={espacio.imagen || FALLBACK_IMG}
              onError={onImageError}
              alt={`Espacio ${espacio.nombre}`}
              width={1280}
              height={720}
              className="w-full h-64 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="p-6 space-y-3">
              <h2 id="reserva-title" className="text-2xl font-bold text-[#002E3E]">
                {espacio.nombre}
              </h2>
              <p className="text-gray-600">
                {espacio.descripcion || "Espacio disponible para reserva en Refinería Aconcagua."}
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  Tipo: <strong>{espacio.tipo}</strong>
                </li>
                <li>
                  Capacidad: <strong>{espacio.capacidad ?? 1}</strong> personas
                </li>
                <li>
                  Tarifa:{" "}
                  <strong className="text-[#DEC01F]">
                    ${CLP.format(espacio.tarifa)}/día
                  </strong>
                </li>
              </ul>
            </div>
          </motion.article>

          {/* 📅 Formulario de reserva */}
          <motion.form
            onSubmit={handleSubmit}
            initial={prefersReducedMotion ? undefined : { opacity: 0, x: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-100"
            aria-describedby="form-ayuda"
          >
            <h3 className="text-2xl font-bold text-[#002E3E]">Datos de la Reserva</h3>

            <p id="form-ayuda" className="text-xs text-gray-500">
              Ingresa fechas y cantidad de personas para calcular el total automáticamente.
            </p>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFechaInicio(val);
                    // si fin es menor a inicio, lo ajustamos
                    if (fechaFin && parseLocal(fechaFin)! < parseLocal(val)!) {
                      setFechaFin(val);
                    }
                  }}
                  min={today}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002E3E]"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Fecha de Fin
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={endMin}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002E3E]"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Cantidad de Personas
                <input
                  type="number"
                  value={personas}
                  onChange={(e) => setPersonas(Math.max(1, Number(e.target.value) || 1))}
                  min={1}
                  {...(espacio.capacidad ? { max: espacio.capacidad } as any : {})}
                  required
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002E3E]"
                />
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg font-bold text-[#002E3E]">
                <DollarSign size={22} /> Total
              </span>
              <span className="text-[#DEC01F] font-bold text-xl">
                ${CLP.format(total)}
              </span>
            </div>

            <motion.button
              whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
              type="submit"
              disabled={disabled}
              className={`w-full font-bold py-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DEC01F]/60 ${
                disabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-[#002E3E] hover:bg-[#003B4D] text-white"
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
