import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Info } from "lucide-react";

import { useEspacios } from "@/context/EspaciosContext";
import { useNotificacion } from "@/context/NotificacionContext";

import { InputEnap } from "@/components/ui/InputEnap";
import { SelectEnap } from "@/components/ui/SelectEnap";

import logoEnap from "@/assets/logo-enap.png";

/* ============================================================
 * TIPOS
 * ============================================================ */
import type {
  TipoEspacio,
  ModalidadCobro,
  EspacioDTO,
} from "@/types/espacios";

type NuevoEspacioForm = Omit<
  EspacioDTO,
  "id" | "createdAt" | "updatedAt"
>;

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

/* ============================================================
 * REGLAS ENAP OFICIALES
 * ============================================================ */
const DEFAULTS: Record<
  TipoEspacio,
  {
    modalidad: ModalidadCobro;
    capacidad: number;
    precioBaseSocio: number;
    precioBaseExterno: number;
  }
> = {
  CABANA: {
    modalidad: "POR_NOCHE",
    capacidad: 6,
    precioBaseSocio: 25000,
    precioBaseExterno: 60000,
  },
  QUINCHO: {
    modalidad: "POR_DIA",
    capacidad: 15,
    precioBaseSocio: 10000,
    precioBaseExterno: 30000,
  },
  PISCINA: {
    modalidad: "POR_PERSONA",
    capacidad: 100,
    precioBaseSocio: 0,
    precioBaseExterno: 0,
  },
};

const INITIAL_FORM: NuevoEspacioForm = {
  nombre: "",
  tipo: "CABANA",
  capacidad: 6,

  descripcion: null,
  imagenUrl: logoEnap,

  activo: true,
  visible: true,
  orden: 0,

  modalidadCobro: "POR_NOCHE",

  precioBaseSocio: 25000,
  precioBaseExterno: 60000,

  precioPersonaAdicionalSocio: 3500,
  precioPersonaAdicionalExterno: 4500,

  precioPiscinaSocio: 3500,
  precioPiscinaExterno: 4000,
};

const ModalNuevoEspacio: React.FC<Props> = ({ abierto, onCerrar }) => {
  const { crearEspacio } = useEspacios();
  const { agregarNotificacion } = useNotificacion();

  const [form, setForm] = useState<NuevoEspacioForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  /* ============================================================
   * Reset al abrir
   * ============================================================ */
  useEffect(() => {
    if (abierto) setForm(INITIAL_FORM);
  }, [abierto]);

  /* ============================================================
   * Reglas automáticas por tipo
   * ============================================================ */
  useEffect(() => {
    const cfg = DEFAULTS[form.tipo];

    setForm((prev) => ({
      ...prev,
      capacidad: cfg.capacidad,
      modalidadCobro: cfg.modalidad,
      precioBaseSocio: cfg.precioBaseSocio,
      precioBaseExterno: cfg.precioBaseExterno,
    }));
  }, [form.tipo]);

  /* ============================================================
   * Submit
   * ============================================================ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await crearEspacio({
        ...form,
        descripcion: form.descripcion?.trim() || null,
        imagenUrl:
          form.imagenUrl && form.imagenUrl.startsWith("http")
            ? form.imagenUrl
            : null,
      });

      agregarNotificacion("Espacio creado correctamente", "success");
      onCerrar();
    } catch {
      agregarNotificacion("❌ Error al crear espacio", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!abierto) return null;

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
          className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#002E3E]">
              Nuevo Espacio ENAP
            </h2>
            <button onClick={onCerrar}>
              <X />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputEnap
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={(e) =>
                setForm({ ...form, nombre: e.target.value })
              }
            />

            <SelectEnap
              label="Tipo de espacio"
              name="tipo"
              value={form.tipo}
              onChange={(e) =>
                setForm({ ...form, tipo: e.target.value as TipoEspacio })
              }
            >
              <option value="CABANA">Cabaña</option>
              <option value="QUINCHO">Quincho</option>
              <option value="PISCINA">Piscina</option>
            </SelectEnap>

            {/* INFO FIJA */}
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 flex gap-2">
              <Info size={18} />
              <div>
                Modalidad: <strong>{form.modalidadCobro}</strong>
                <br />
                Capacidad máxima: <strong>{form.capacidad}</strong> personas
              </div>
            </div>

            <InputEnap
              label="Precio base Socio (CLP)"
              name="precioBaseSocio"
              type="number"
              value={form.precioBaseSocio}
              onChange={(e) =>
                setForm({ ...form, precioBaseSocio: Number(e.target.value) })
              }
            />

            <InputEnap
              label="Precio base Externo (CLP)"
              name="precioBaseExterno"
              type="number"
              value={form.precioBaseExterno}
              onChange={(e) =>
                setForm({ ...form, precioBaseExterno: Number(e.target.value) })
              }
            />

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="btn-enap-primary w-full flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "Guardando..." : "Crear espacio"}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalNuevoEspacio;
