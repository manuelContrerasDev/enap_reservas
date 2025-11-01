import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { useEspacios } from "../../context/EspaciosContext";
import { useNotificacion } from "../../context/NotificacionContext";
import { Espacio } from "../../context/EspaciosContext";
import { supabase } from "../../lib/supabase";


interface ModalEditarEspacioProps {
  abierto: boolean;
  onCerrar: () => void;
  espacio: Espacio | null;
}

/**
 * Modal animado para editar un espacio existente (modo admin)
 */
const ModalEditarEspacio: React.FC<ModalEditarEspacioProps> = ({
  abierto,
  onCerrar,
  espacio,
}) => {
  const { cargarEspacios } = useEspacios();
  const { agregarNotificacion } = useNotificacion();
  const [form, setForm] = useState<Espacio | null>(espacio);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setForm(espacio);
  }, [espacio]);

  if (!form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) =>
      prev ? { ...prev, [name]: type === "number" ? Number(value) : value } : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setCargando(true);

    try {
      const { error } = await supabase
        .from("espacios")
        .update({
          nombre: form.nombre,
          tipo: form.tipo,
          tarifa: form.tarifa,
          capacidad: form.capacidad,
          descripcion: form.descripcion,
          imagen: form.imagen,
          activo: form.activo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", form.id);

      if (error) throw error;

      agregarNotificacion("✅ Espacio actualizado correctamente", "success");
      await cargarEspacios();
      onCerrar();
    } catch (err) {
      agregarNotificacion("❌ Error al actualizar el espacio", "error");
      console.error("Error actualizando espacio:", err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
          >
            <button
              onClick={onCerrar}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-[#004b87] mb-4 text-center">
              Editar Espacio
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004b87]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tipo
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004b87]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Tarifa ($CLP)
                  </label>
                  <input
                    type="number"
                    name="tarifa"
                    min={0}
                    value={form.tarifa}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004b87]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Capacidad
                  </label>
                  <input
                    type="number"
                    name="capacidad"
                    min={1}
                    value={form.capacidad}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004b87]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Imagen (URL)
                  </label>
                  <input
                    type="text"
                    name="imagen"
                    value={form.imagen ?? ""}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004b87]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={3}
                  value={form.descripcion}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#004b87]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="activo"
                  checked={form.activo}
                  onChange={() => setForm((p) => (p ? { ...p, activo: !p.activo } : p))}
                />
                <span className="text-sm text-gray-600">Activo</span>
              </div>

              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={cargando}
                className="w-full flex items-center justify-center gap-2 bg-[#004b87] text-white py-3 rounded-lg font-semibold hover:bg-[#003666] transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {cargando ? "Guardando..." : "Guardar Cambios"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalEditarEspacio;
