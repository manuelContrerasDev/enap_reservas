import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { DollarSign, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { supabase, Espacio } from "../lib/supabase";
import { useReserva } from "../context/ReservaContext";
import { useNotificacion } from "../context/NotificacionContext";

/**
 * ReservaForm — Creación y confirmación de reservas.
 */
const ReservaForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reservaActual, setReservaActual } = useReserva();
  const { agregarNotificacion } = useNotificacion();

  const [espacio, setEspacio] = useState<Espacio | null>(null);
  const [loading, setLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [personas, setPersonas] = useState(1);
  const [error, setError] = useState<string | null>(null);

  /** 🔄 Cargar información del espacio seleccionado */
  const getEspacio = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("espacios")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError("Espacio no encontrado");
        agregarNotificacion("Espacio no encontrado", "error");
        return;
      }
      setEspacio(data);

      // ✅ Inicializa draft en contexto con datos del espacio
      setReservaActual({
        espacioId: data.id,
        espacioNombre: data.nombre,
        tarifa: data.tarifa,
        // Si ya había fechas/personas en el draft, las conservamos desde el context (lo maneja el setter)
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
    getEspacio();
  }, [getEspacio]);

  /** 🔁 Mantener el draft sincronizado con el contexto en cada cambio */
  useEffect(() => {
    if (!espacio) return;
    setReservaActual({
      fechaInicio,
      fechaFin,
      personas,
      tarifa: espacio.tarifa,      // refuerza tarifa por si cambió el espacio
      espacioId: espacio.id,
      espacioNombre: espacio.nombre,
    });
  }, [fechaInicio, fechaFin, personas, espacio, setReservaActual]);

  /** 💾 Confirmar reserva */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!espacio) return;

    // Validaciones
    if (!fechaInicio || !fechaFin) {
      agregarNotificacion("Por favor completa las fechas.", "error");
      return;
    }
    if (personas > espacio.capacidad) {
      agregarNotificacion(`La capacidad máxima es de ${espacio.capacidad} personas.`, "error");
      return;
    }
    const total = reservaActual?.total ?? 0;
    if (total <= 0) {
      agregarNotificacion("Revisa el rango de fechas. El total no puede ser 0.", "error");
      return;
    }

    // Pasamos a /pago, el contexto ya lleva el draft completo con total recalculado
    agregarNotificacion("Reserva creada exitosamente", "success");
    navigate("/pago");
  };

  // 🚫 Caso: acceso sin ID
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

  // 🕐 Cargando
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#002E3E]">
        <Loader2 className="animate-spin" size={48} />
        <p className="text-sm text-gray-600 mt-3">Cargando información del espacio...</p>
      </div>
    );
  }

  // ⚠️ Error
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

  const totalCalculado = reservaActual?.total ?? 0;

  // ✅ Vista principal
  return (
    <main
      className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] py-12 px-6 flex flex-col items-center"
      role="main"
    >
      <div className="max-w-7xl w-full">
        <button
          onClick={() => navigate("/espacios")}
          className="flex items-center gap-2 text-[#002E3E] hover:text-[#003B4D] mb-6 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Volver a espacios
        </button>

        <div className="grid md:grid-cols-2 gap-10">
          {/* 🏡 Información del espacio */}
          <motion.article
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <img
              src={espacio.imagen}
              alt={`Imagen del espacio ${espacio.nombre}`}
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="p-6 space-y-3">
              <h2 className="text-2xl font-bold text-[#002E3E]">{espacio.nombre}</h2>
              <p className="text-gray-600">{espacio.descripcion}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Tipo: <strong>{espacio.tipo}</strong></li>
                <li>Capacidad: <strong>{espacio.capacidad}</strong> personas</li>
                <li>
                  Tarifa:{" "}
                  <strong className="text-[#DEC01F]">
                    ${espacio.tarifa.toLocaleString("es-CL")}/día
                  </strong>
                </li>
              </ul>
            </div>
          </motion.article>

          {/* 📅 Formulario */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 space-y-6 border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-[#002E3E] mb-2">
              Datos de la Reserva
            </h3>

            {/* Campos */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Fecha de Inicio
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002E3E]"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Fecha de Fin
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  min={fechaInicio || new Date().toISOString().split("T")[0]}
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002E3E]"
                  required
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Cantidad de Personas
                <input
                  type="number"
                  value={personas}
                  onChange={(e) => setPersonas(Number(e.target.value))}
                  min={1}
                  max={espacio.capacidad}
                  className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002E3E]"
                  required
                />
              </label>
            </div>

            {/* Total */}
            <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
              <span className="flex items-center gap-2 text-lg font-bold text-[#002E3E]">
                <DollarSign size={22} /> Total
              </span>
              <span className="text-[#DEC01F] font-bold text-xl">
                ${totalCalculado.toLocaleString("es-CL")}
              </span>
            </div>

            {/* Botón */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-[#002E3E] hover:bg-[#003B4D] text-white font-bold py-4 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DEC01F]/60"
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
