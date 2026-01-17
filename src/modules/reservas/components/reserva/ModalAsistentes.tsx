// ============================================================================
// ModalAsistentes.tsx — ENAP 2025 (FINAL SYNC)
// ============================================================================

import React, { useEffect, useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";

/* ============================================================
 * MODELO INVITADO
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

  admitePiscina: boolean;
  maxPiscina?: number;
}

export default function ModalAsistentes({
  isOpen,
  onClose,
  onSave,
  initial = [],
  maxCantidad,
  admitePiscina,
  maxPiscina = Infinity,
}: Props) {
  const { agregarNotificacion } = useNotificacion();
  const [lista, setLista] = useState<Invitado[]>([]);

  /* ============================================================
   * SYNC INICIAL
   * ============================================================ */
  useEffect(() => {
    setLista(
      initial.map((i) => ({
        nombre: i.nombre ?? "",
        rut: i.rut ?? "",
        edad: i.edad,
        esPiscina: Boolean(i.esPiscina),
      }))
    );
  }, [initial]);

  if (!isOpen) return null;

  /* ============================================================
   * HELPERS
   * ============================================================ */
  const canAddMore = lista.length < maxCantidad;
  const piscinaUsados = lista.filter((i) => i.esPiscina).length;

  /* ============================================================
   * ACTIONS
   * ============================================================ */
  const addRow = () => {
    if (!canAddMore) {
      agregarNotificacion(
        `Máximo permitido: ${maxCantidad} asistentes.`,
        "error"
      );
      return;
    }

    setLista((prev) => [
      ...prev,
      { nombre: "", rut: "", edad: undefined, esPiscina: false },
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
    /* obligatorios */
    if (lista.some((i) => !i.nombre.trim() || !i.rut.trim())) {
      agregarNotificacion(
        "Todos los asistentes deben tener nombre y RUT.",
        "error"
      );
      return;
    }

    /* normalización piscina */
    const normalizados = lista.map((i) => ({
      ...i,
      esPiscina: admitePiscina ? i.esPiscina : false,
    }));

    onSave(normalizados);
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
            <h2 className="text-xl font-bold text-[#003B4D]">
              Asistentes ({lista.length}/{maxCantidad})
            </h2>
            {admitePiscina && (
              <p className="text-xs text-gray-500 mt-1">
                Personas con piscina: {piscinaUsados}/{maxPiscina}
              </p>
            )}
          </div>

          <button onClick={onClose} className="text-gray-600">
            <X size={22} />
          </button>
        </div>

        {/* TABLA */}
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-y-auto max-h-[50vh]">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Nombre</th>
                  <th className="px-3 py-2">RUT</th>
                  {admitePiscina && (
                    <th className="px-3 py-2 text-center">Piscina</th>
                  )}
                  <th className="px-3 py-2 text-center">Acción</th>
                </tr>
              </thead>

              <tbody>
                {lista.map((inv, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-3 py-2">{index + 1}</td>

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

                    {admitePiscina && (
                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={inv.esPiscina}
                          disabled={
                            !inv.esPiscina &&
                            piscinaUsados >= maxPiscina
                          }
                          onChange={(e) =>
                            update(index, "esPiscina", e.target.checked)
                          }
                        />
                      </td>
                    )}

                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => remove(index)}
                        className="text-red-600"
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
        <div className="flex justify-between mt-4 pt-3 border-t">
          <button
            onClick={addRow}
            disabled={!canAddMore}
            className="px-4 py-2 rounded-lg text-xs bg-[#00A3C4] text-white"
          >
            <UserPlus size={14} /> Añadir fila
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
