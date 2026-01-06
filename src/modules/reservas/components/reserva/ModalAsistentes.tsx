// ============================================================================
// ModalAsistentes.tsx — UX/UI Premium ENAP 2025 (FINAL SAFE)
// ============================================================================

import React, { useEffect, useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { useNotificacion } from "@/context/NotificacionContext";

/* ============================================================
 * MODELO INVITADO (FRONTEND SNAPSHOT)
 * ============================================================ */
export interface Invitado {
  nombre: string;
  rut: string;
  edad?: number;
  esPiscina: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invitados: Invitado[]) => void;
  initial?: Invitado[];
  maxCantidad: number;
  maxPiscina?: number;
}

export default function ModalAsistentes({
  isOpen,
  onClose,
  onSave,
  initial = [],
  maxCantidad,
  maxPiscina = Infinity,
}: Props) {
  const { agregarNotificacion } = useNotificacion();
  const [lista, setLista] = useState<Invitado[]>([]);

  /* ============================================================
   * SYNC INICIAL (DEFENSIVO)
   * ============================================================ */
  useEffect(() => {
    setLista(
      (initial ?? []).map((i) => ({
        nombre: i.nombre ?? "",
        rut: i.rut ?? "",
        edad: i.edad,
        esPiscina: Boolean(i.esPiscina), // ✅ siempre boolean
      }))
    );
  }, [initial]);

  if (!isOpen) return null;

  /* ============================================================
   * HELPERS
   * ============================================================ */
  const totalPiscina = lista.filter((i) => i.esPiscina).length;
  const canAddMore = lista.length < maxCantidad;

  /* ============================================================
   * ACTIONS
   * ============================================================ */
  const addRow = () => {
    if (!canAddMore) {
      agregarNotificacion(
        `El máximo permitido es ${maxCantidad} asistentes.`,
        "error"
      );
      return;
    }

    setLista((prev) => [
      ...prev,
      {
        nombre: "",
        rut: "",
        edad: undefined,
        esPiscina: false,
      },
    ]);
  };

  const update = <K extends keyof Invitado>(
    index: number,
    field: K,
    value: Invitado[K]
  ) => {
    setLista((prev) =>
      prev.map((inv, i) =>
        i === index ? { ...inv, [field]: value } : inv
      )
    );
  };

  const remove = (index: number) => {
    setLista((prev) => prev.filter((_, i) => i !== index));
  };

  const guardar = () => {
    /* -------- cantidad exacta -------- */
    if (lista.length !== maxCantidad) {
      agregarNotificacion(
        `Debes registrar exactamente ${maxCantidad} asistente(s).`,
        "error"
      );
      return;
    }

    /* -------- campos obligatorios -------- */
    const invalid = lista.some(
      (i) => !i.nombre.trim() || !i.rut.trim()
    );

    if (invalid) {
      agregarNotificacion(
        "Todos los asistentes deben tener nombre y RUT.",
        "error"
      );
      return;
    }

    /* -------- validación piscina -------- */
    if (totalPiscina > maxPiscina) {
      agregarNotificacion(
        `Marcaste ${totalPiscina} personas para piscina, pero declaraste ${maxPiscina}.`,
        "error"
      );
      return;
    }

    onSave(lista);
    onClose();
  };

  /* ============================================================
   * RENDER
   * ============================================================ */
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-enap-azul">
              Asistentes ({lista.length}/{maxCantidad})
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Marca quiénes harán uso de la piscina.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        {/* TABLA */}
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-y-auto max-h-[50vh]">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold">#</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">
                    Nombre
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold">
                    RUT
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold w-20">
                    Piscina
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold w-16">
                    Acción
                  </th>
                </tr>
              </thead>

              <tbody>
                {lista.map((inv, index) => (
                  <tr key={index} className="border-b last:border-b-0">
                    <td className="px-3 py-2 text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-3 py-2">
                      <input
                        value={inv.nombre}
                        onChange={(e) =>
                          update(index, "nombre", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-xs"
                      />
                    </td>

                    <td className="px-3 py-2">
                      <input
                        value={inv.rut}
                        onChange={(e) =>
                          update(index, "rut", e.target.value)
                        }
                        className="w-full border rounded px-2 py-1 text-xs"
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={inv.esPiscina}
                        onChange={(e) =>
                          update(index, "esPiscina", e.target.checked)
                        }
                        className="h-4 w-4 accent-enap-cyan cursor-pointer"
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <button
            onClick={addRow}
            disabled={!canAddMore}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs ${
              canAddMore
                ? "bg-enap-cyan hover:bg-enap-azul text-dark"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <UserPlus size={16} /> Añadir fila
          </button>

          <button
            onClick={guardar}
            className="px-6 py-3 bg-[#003B4D] text-white rounded-xl font-bold"
          >
            Guardar lista
          </button>
        </div>
      </div>
    </div>
  );
}
