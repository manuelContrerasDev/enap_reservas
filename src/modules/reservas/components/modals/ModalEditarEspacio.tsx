import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, RefreshCw, Image as ImageIcon } from "lucide-react";

import { useEspacios } from "@/context/EspaciosContext";
import { useNotificacion } from "@/context/NotificacionContext";
import type { Espacio } from "@/context/EspaciosContext";

import { InputEnap } from "@/components/ui/InputEnap";
import { SelectEnap } from "@/components/ui/SelectEnap";

import logoEnap from "@/assets/logo-enap.png";

interface ModalEditarEspacioProps {
  abierto: boolean;
  onCerrar: () => void;
  espacio: Espacio | null;
}

const ENAP_DEFAULTS = {
  tarifas: {
    socio: 25000,
    externo: 35000,
  },
  capacidades: {
    CABANA: 10,
    QUINCHO: 10,
    PISCINA: 80,
  },
  modalidad: {
    CABANA: "POR_NOCHE",
    QUINCHO: "POR_NOCHE",
    PISCINA: "POR_DIA",
  },
};

const IMAGENES_DEFAULT = {
  CABANA: logoEnap,
  QUINCHO: logoEnap,
  PISCINA: logoEnap,
};

const EMPTY_FORM = {
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
  modalidadCobro: "POR_NOCHE",
  activo: true,
};

const ModalEditarEspacio: React.FC<ModalEditarEspacioProps> = ({
  abierto,
  onCerrar,
  espacio,
}) => {
  const { editarEspacio } = useEspacios();
  const { agregarNotificacion } = useNotificacion();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(true);

  useEffect(() => {
    if (abierto && espacio) {
      setForm({
        nombre: espacio.nombre,
        tipo: espacio.tipo,
        capacidad: espacio.capacidad,
        capacidadExtra: espacio.capacidadExtra ?? 0,
        tarifaClp: espacio.tarifaClp ?? 0,
        tarifaExterno: espacio.tarifaExterno ?? 0,
        extraSocioPorPersona: espacio.extraSocioPorPersona ?? 0,
        extraTerceroPorPersona: espacio.extraTerceroPorPersona ?? 0,
        descripcion: espacio.descripcion ?? "",
        imagenUrl: espacio.imagenUrl ?? logoEnap,
        modalidadCobro: espacio.modalidadCobro,
        activo: espacio.activo,
      });
      setErrors({});
      setImgLoaded(true);
    }

    if (!abierto) {
      setForm(EMPTY_FORM);
      setErrors({});
      setImgLoaded(true);
    }
  }, [abierto, espacio]);

  // Ajuste auto según tipo (capacidad, modalidad, default image)
  useEffect(() => {
    if (!abierto) return;
    if (!espacio) return;

    const tipo = form.tipo as keyof typeof ENAP_DEFAULTS.capacidades;

    setForm((prev) => ({
      ...prev,
      capacidad: ENAP_DEFAULTS.capacidades[tipo],
      modalidadCobro: ENAP_DEFAULTS.modalidad[tipo],
      imagenUrl: prev.imagenUrl || IMAGENES_DEFAULT[tipo],
    }));
    setImgLoaded(true);
  }, [form.tipo, abierto]);

  const restaurarValores = () => {
    if (!espacio) return;

    const tipo = espacio.tipo as keyof typeof ENAP_DEFAULTS.capacidades;

    setForm((prev) => ({
      ...prev,
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

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;

      setForm((prev) => {
        if (type === "number") {
          return {
            ...prev,
            [name]: value === "" ? null : Math.max(0, Number(value)),
          };
        }

        if (name === "imagenUrl") {
          setImgLoaded(true);
        }

        if (name === "descripcion") {
          return {
            ...prev,
            [name]: value === "" ? "" : value,
          };
        }

        return { ...prev, [name]: value };
      });
    },
    []
  );

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }

    if (form.capacidad == null || form.capacidad <= 0) {
      newErrors.capacidad = "La capacidad debe ser mayor a 0.";
    }

    if (form.tarifaClp == null || form.tarifaClp < 0) {
      newErrors.tarifaClp = "La tarifa no puede ser negativa.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!espacio) return;
    if (cargando) return;

    if (!validateForm()) return;

    setCargando(true);
    try {
      await editarEspacio(espacio.id, {
        ...form,

        // normalizar descripción
        descripcion: form.descripcion?.trim() || null,

        // normalizar imagen
        imagenUrl:
          form.imagenUrl &&
          typeof form.imagenUrl === "string" &&
          form.imagenUrl.startsWith("http")
            ? form.imagenUrl
            : null,
      } as any);


      agregarNotificacion("Espacio actualizado correctamente", "success");
      onCerrar();
    } catch (err) {
      console.error(err);
      agregarNotificacion("Error al actualizar el espacio", "error");
    } finally {
      setCargando(false);
    }
  };

  if (!abierto || !espacio) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCerrar}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 260 }}
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative"
          onClick={(e) => e.stopPropagation()}  // ⬅️ CLICK DENTRO → NO CERRAR
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
          <p className="text-xs text-gray-500 text-center mb-4">
            Ajusta los datos del espacio. Estos cambios afectan el catálogo visible para los socios.
          </p>

          <button
            type="button"
            onClick={restaurarValores}
            className="mb-4 inline-flex items-center gap-2 px-3 py-2 bg-[#DEC01F] text-[#002E3E] rounded-lg shadow hover:bg-[#E5C845] font-semibold text-xs"
          >
            <RefreshCw size={14} /> Restaurar valores
          </button>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Datos generales */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[#002E3E] uppercase tracking-wide text-center">
                Datos generales
              </h3>
              
              <InputEnap
                label="Nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                error={errors.nombre}
              />

              <div className="grid grid-cols-2 gap-4">
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
                </SelectEnap>
              </div>
            </section>

            {/* Capacidad */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[#002E3E] uppercase tracking-wide text-center">
                Capacidad
              </h3>
              <hr className="border-[#002E3E]/20 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <InputEnap
                  label="Capacidad base"
                  name="capacidad"
                  type="number"
                  value={form.capacidad}
                  onChange={handleChange}
                  error={errors.capacidad}
                  min={1}
                />
                <InputEnap
                  label="Capacidad extra"
                  name="capacidadExtra"
                  type="number"
                  value={form.capacidadExtra ?? ""}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </section>

            {/* Tarifas */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[#002E3E] uppercase tracking-wide text-center">
                Tarifas
              </h3>
              <hr className="border-[#002E3E]/20 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <InputEnap
                  label="Tarifa Socio (CLP)"
                  name="tarifaClp"
                  type="number"
                  value={form.tarifaClp}
                  onChange={handleChange}
                  error={errors.tarifaClp}
                  min={0}
                />
                <InputEnap
                  label="Tarifa Externo (CLP)"
                  name="tarifaExterno"
                  type="number"
                  value={form.tarifaExterno ?? ""}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </section>

            {/* Extras */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[#002E3E] uppercase tracking-wide text-center">
                Extras por persona
              </h3>

              <hr className="border-[#002E3E]/20 mb-4" />

              <div className="grid grid-cols-2 gap-4">
                <InputEnap
                  label="Extra Socio (CLP)"
                  name="extraSocioPorPersona"
                  type="number"
                  value={form.extraSocioPorPersona ?? ""}
                  onChange={handleChange}
                  min={0}
                />
                <InputEnap
                  label="Extra Tercero (CLP)"
                  name="extraTerceroPorPersona"
                  type="number"
                  value={form.extraTerceroPorPersona ?? ""}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </section>

            {/* Imagen + descripción */}
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-[#002E3E] uppercase tracking-wide text-center">
                Imagen y descripción
              </h3>

              <hr className="border-[#002E3E]/20 mb-4" />

              <InputEnap
                label="URL de imagen (opcional)"
                name="imagenUrl"
                value={form.imagenUrl}
                onChange={handleChange}
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#002E3E]">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  rows={3}
                  value={form.descripcion ?? ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:ring-2 focus:ring-[#002E3E] focus:border-[#002E3E]"
                />
              </div>

              {/* Preview abajo */}
              <div className="mt-3 rounded-xl border-2 border-[#002E3E] shadow-sm p-2 bg-white">
                {imgLoaded && form.imagenUrl ? (
                  <img
                    src={form.imagenUrl}
                    alt="Preview espacio"
                    className="w-full h-40 object-contain rounded-md bg-white"
                    onError={() => setImgLoaded(false)}
                  />
                ) : (
                  <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-100 rounded-md text-gray-500">
                    <ImageIcon size={40} />
                    <p className="mt-2 text-xs">
                      No se pudo cargar la imagen. Se usará el logo ENAP.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Activo */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.activo}
                onChange={() =>
                  setForm((prev) => ({ ...prev, activo: !prev.activo }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm text-gray-700 font-medium">
                Espacio activo para reservas
              </span>
            </div>

            {/* Botón submit */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={cargando}
              className="mt-3 btn-enap-primary w-full flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {cargando ? "Guardando..." : "Guardar cambios"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalEditarEspacio;
