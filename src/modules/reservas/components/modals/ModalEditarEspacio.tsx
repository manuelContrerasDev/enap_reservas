// src/modules/reservas/components/modals/ModalEditarEspacio.tsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, RefreshCw, Image as ImageIcon } from "lucide-react";

import { useEspacios } from "@/context/EspaciosContext";
import { useNotificacion } from "@/context/NotificacionContext";

import type {
  EspacioDTO,
  ActualizarEspacioDTO,
} from "@/types/espacios";

import { InputEnap } from "@/components/ui/InputEnap";
import { SelectEnap } from "@/components/ui/SelectEnap";

import logoEnap from "@/assets/logo-enap.png";

interface ModalEditarEspacioProps {
  abierto: boolean;
  onCerrar: () => void;
  espacio: EspacioDTO | null;
}

/**
 * Form ADMIN: solo campos permitidos
 */
const EMPTY_FORM: ActualizarEspacioDTO = {
  nombre: "",
  descripcion: null,
  imagenUrl: null,
  activo: true,
};

const ModalEditarEspacio: React.FC<ModalEditarEspacioProps> = ({
  abierto,
  onCerrar,
  espacio,
}) => {
  const { editarEspacio } = useEspacios();
  const { agregarNotificacion } = useNotificacion();

  const [form, setForm] = useState<ActualizarEspacioDTO>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(true);

  /* ============================================================
   * Cargar datos al abrir
   * ============================================================ */
  useEffect(() => {
    if (abierto && espacio) {
      setForm({
        nombre: espacio.nombre,
        descripcion: espacio.descripcion,
        imagenUrl: espacio.imagenUrl,
        activo: espacio.activo,
      });
      setImgLoaded(true);
    }

    if (!abierto) {
      setForm(EMPTY_FORM);
      setImgLoaded(true);
    }
  }, [abierto, espacio]);

  /* ============================================================
   * Change handler
   * ============================================================ */
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;

      setForm((prev) => ({
        ...prev,
        [name]: value === "" ? null : value,
      }));

      if (name === "imagenUrl") {
        setImgLoaded(true);
      }
    },
    []
  );

  /* ============================================================
   * Submit
   * ============================================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!espacio || loading) return;

    setLoading(true);
    try {
      await editarEspacio(espacio.id, {
        ...form,
        descripcion: form.descripcion?.trim() || null,
        imagenUrl:
          form.imagenUrl && form.imagenUrl.startsWith("http")
            ? form.imagenUrl
            : null,
      });

      agregarNotificacion("Espacio actualizado correctamente", "success");
      onCerrar();
    } catch {
      agregarNotificacion("Error al actualizar el espacio", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!abierto || !espacio) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onCerrar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <button
            onClick={onCerrar}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>

          <h2 className="text-2xl font-bold text-[#002E3E] mb-2 text-center">
            Editar Espacio ENAP
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputEnap
              label="Nombre"
              name="nombre"
              value={form.nombre ?? ""}
              onChange={handleChange}
            />

            <InputEnap
              label="URL de imagen"
              name="imagenUrl"
              value={form.imagenUrl ?? ""}
              onChange={handleChange}
            />

            <div>
              <label className="text-sm font-semibold text-[#002E3E]">
                Descripción
              </label>
              <textarea
                name="descripcion"
                rows={3}
                value={form.descripcion ?? ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
            </div>

            <div className="mt-3 rounded-xl border p-2">
              {imgLoaded && form.imagenUrl ? (
                <img
                  src={form.imagenUrl}
                  onError={() => setImgLoaded(false)}
                  className="w-full h-40 object-contain rounded"
                />
              ) : (
                <div className="w-full h-40 flex items-center justify-center text-gray-500">
                  <ImageIcon size={40} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!form.activo}
                onChange={() =>
                  setForm((prev) => ({ ...prev, activo: !prev.activo }))
                }
              />
              <span className="text-sm">Espacio activo</span>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="btn-enap-primary w-full flex justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Guardar cambios"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalEditarEspacio;
