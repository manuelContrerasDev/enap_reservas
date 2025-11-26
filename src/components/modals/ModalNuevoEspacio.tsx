// ----------------------------------------------
// ModalNuevoEspacio — Versión Compactada + Elegante
// ----------------------------------------------
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, RefreshCw, Image as ImageIcon } from "lucide-react";

import { useEspacios } from "@/context/EspaciosContext";
import { useNotificacion } from "@/context/NotificacionContext";

import { InputEnap } from "@/components/ui/InputEnap";
import { SelectEnap } from "@/components/ui/SelectEnap";

import logoEnap from "@/assets/logo-enap.png";

interface ModalNuevoEspacioProps {
  abierto: boolean;
  onCerrar: () => void;
}

const ENAP_DEFAULTS = {
  tarifas: { socio: 25000, externo: 35000 },
  capacidades: { CABANA: 10, QUINCHO: 10, PISCINA: 80 },
  modalidad: { CABANA: "POR_NOCHE", QUINCHO: "POR_NOCHE", PISCINA: "POR_DIA" },
};

const IMAGENES_DEFAULT = {
  CABANA: logoEnap,
  QUINCHO: logoEnap,
  PISCINA: logoEnap,
};

const DEFAULT_FORM = {
  nombre: "",
  tipo: "CABANA",
  capacidad: 10,
  capacidadExtra: null as number | null,
  tarifaClp: 25000,
  tarifaExterno: 35000,
  extraSocioPorPersona: null as number | null,
  extraTerceroPorPersona: null as number | null,
  descripcion: "" as string | null,
  imagenUrl: logoEnap as string | null,
  modalidadCobro: "POR_DIA",
  activo: true,
};

const ModalNuevoEspacio: React.FC<ModalNuevoEspacioProps> = ({
  abierto,
  onCerrar,
}) => {
  const { espacios, crearEspacio } = useEspacios();
  const { agregarNotificacion } = useNotificacion();

  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(true);

  // Reset al abrir
  useEffect(() => {
    if (abierto) {
      setForm(DEFAULT_FORM);
      setErrors({});
      setImgLoaded(true);
    }
  }, [abierto]);

  // Auto valores según tipo
  useEffect(() => {
    if (!abierto) return;

    const tipo = form.tipo as keyof typeof ENAP_DEFAULTS.capacidades;
    const cantidad = espacios.filter((e) => e.tipo === form.tipo).length;

    const nombreAuto =
      form.tipo === "PISCINA"
        ? "Piscina General"
        : form.tipo === "CABANA"
        ? `Cabaña ${cantidad + 1}`
        : `Quincho ${cantidad + 1}`;

    setForm((prev) => ({
      ...prev,
      nombre: prev.nombre?.trim() ? prev.nombre : nombreAuto,
      capacidad: ENAP_DEFAULTS.capacidades[tipo],
      modalidadCobro: ENAP_DEFAULTS.modalidad[tipo],
      imagenUrl: prev.imagenUrl || IMAGENES_DEFAULT[tipo],
    }));
  }, [form.tipo, espacios, abierto]);

  const restaurarValores = () => {
    const tipo = form.tipo as keyof typeof ENAP_DEFAULTS.capacidades;
    const cantidad = espacios.filter((e) => e.tipo === form.tipo).length;

    const nombreAuto =
      tipo === "PISCINA"
        ? "Piscina General"
        : tipo === "CABANA"
        ? `Cabaña ${cantidad + 1}`
        : `Quincho ${cantidad + 1}`;

    setForm((prev) => ({
      ...prev,
      nombre: nombreAuto,
      capacidad: ENAP_DEFAULTS.capacidades[tipo],
      tarifaClp: ENAP_DEFAULTS.tarifas.socio,
      tarifaExterno: ENAP_DEFAULTS.tarifas.externo,
      modalidadCobro: ENAP_DEFAULTS.modalidad[tipo],
      imagenUrl: IMAGENES_DEFAULT[tipo],
    }));

    setErrors({});
    setImgLoaded(true);
    agregarNotificacion("Valores estándar ENAP restaurados", "info");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.capacidad || form.capacidad <= 0) newErrors.capacidad = "Debe ser mayor a 0.";
    if (form.tarifaClp < 0) newErrors.tarifaClp = "La tarifa no puede ser negativa.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setCargando(true);

    try {
      await crearEspacio({
        ...form,
        imagenUrl:
          form.imagenUrl && form.imagenUrl.startsWith("http")
            ? form.imagenUrl
            : null,

        descripcion: form.descripcion?.trim() || null,
      });

      agregarNotificacion("Espacio creado correctamente", "success");
      onCerrar();
    } catch (err) {
      agregarNotificacion("❌ Error al crear el espacio", "error");
    } finally {
      setCargando(false);
    }
  };

  if (!abierto) return null;

  return (
    <AnimatePresence>
  <motion.div
    className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onCerrar}     // ⬅️ CLICK FUERA → CERRAR
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 22, stiffness: 260 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative"
      onClick={(e) => e.stopPropagation()} // ⬅️ CLICK DENTRO → NO CERRAR
    >
          {/* Botón cerrar */}
          <button
            onClick={onCerrar}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X size={22} />
          </button>

          {/* TITULO */}
          <h2 className="text-2xl font-bold text-[#002E3E] mb-1 text-center">
            Nuevo Espacio ENAP
          </h2>
          <p className="text-xs text-gray-500 text-center mb-4">
            Completa la información para registrar un nuevo espacio.
          </p>

          {/* Restaurar */}
          <button
                      type="button"
                      onClick={restaurarValores}
                      className="mb-4 inline-flex items-center gap-2 px-3 py-2 bg-[#DEC01F] text-[#002E3E] rounded-lg shadow hover:bg-[#E5C845] font-semibold text-xs"
                    >
                      <RefreshCw size={14} /> Restaurar valores
                    </button>
          

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Sección 1 */}
            <div>
              <h3 className="text-center text-sm font-bold text-[#002E3E] mb-2 uppercase tracking-wide">
                Datos Generales
              </h3>
              <hr className="border-[#002E3E]/20 mb-4" />

              <InputEnap
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />

              <div className="grid grid-cols-2 gap-4 mt-3">
                <SelectEnap
                  label="Tipo de espacio"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                >
                  <option value="CABANA">Cabaña</option>
                  <option value="QUINCHO">Quincho</option>
                  <option value="PISCINA">Piscina</option>
                </SelectEnap>

                <SelectEnap
                  label="Modalidad"
                  name="modalidadCobro"
                  value={form.modalidadCobro}
                  onChange={handleChange}
                >
                  <option value="POR_NOCHE">Por noche</option>
                  <option value="POR_DIA">Por día</option>
                  <option value="POR_PERSONA">Por Persona</option>                </SelectEnap>
              </div>
            </div>

            {/* Sección 2 */}
            <div>
              <h3 className="text-center text-sm font-bold text-[#002E3E] mb-2 uppercase tracking-wide">
                Capacidad
              </h3>
              <hr className="border-[#002E3E]/20 mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <InputEnap
                  label="Capacidad"
                  name="capacidad"
                  type="number"
                  value={form.capacidad ?? 0}
                  onChange={handleChange}
                  min={1}
                  error={errors.capacidad}
                />

                <InputEnap
                  label="Capacidad extra"
                  name="capacidadExtra"
                  type="number"
                  value={form.capacidadExtra ?? 0}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>

            {/* Sección 3 */}
            <div>
              <h3 className="text-center text-sm font-bold text-[#002E3E] mb-2 uppercase tracking-wide">
                Tarifas
              </h3>
              <hr className="border-[#002E3E]/20 mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <InputEnap
                  label="Socio (CLP)"
                  name="tarifaClp"
                  type="number"
                  value={form.tarifaClp ?? 0}
                  onChange={handleChange}
                  min={0}
                  error={errors.tarifaClp}
                />

                <InputEnap
                  label="Externo (CLP)"
                  name="tarifaExterno"
                  type="number"
                  value={form.tarifaExterno ?? 0}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>

            {/* Sección 4 */}
            <div>
              <h3 className="text-center text-sm font-bold text-[#002E3E] mb-2 uppercase tracking-wide">
                Extras por Persona
              </h3>
              <hr className="border-[#002E3E]/20 mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <InputEnap
                  label="Extra Socio"
                  name="extraSocioPorPersona"
                  type="number"
                  value={form.extraSocioPorPersona}
                  onChange={handleChange}
                  min={0}
                />

                <InputEnap
                  label="Extra Tercero"
                  name="extraTerceroPorPersona"
                  type="number"
                  value={form.extraTerceroPorPersona}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>

            {/* Sección 5 */}
            <div>
              <h3 className="text-center text-sm font-bold text-[#002E3E] mb-2 uppercase tracking-wide">
                Imagen y Descripción
              </h3>
              <hr className="border-[#002E3E]/20 mb-4" />

              <InputEnap
                label="URL imagen"
                name="imagenUrl"
                value={form.imagenUrl}
                onChange={handleChange}
              />

              {/* Descripción */}
              <textarea
                name="descripcion"
                rows={3}
                value={form.descripcion ?? ""}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-[#002E3E]"
                placeholder="Descripción opcional del espacio"
              />

              {/* Preview */}
              <div className="mt-4 rounded-xl border border-[#002E3E]/30 p-2">
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
            </div>

            {/* Activo */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={() => setForm((p) => ({ ...p, activo: !p.activo }))}
              />
              <span className="text-sm text-gray-700">Espacio activo para reservas</span>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={cargando}
              className="btn-enap-primary w-full flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {cargando ? "Guardando..." : "Crear espacio"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalNuevoEspacio;
