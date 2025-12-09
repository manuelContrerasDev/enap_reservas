// ============================================================================
// ModalAsistentes.tsx — UX/UI Premium ENAP 2025 (PLANILLA / TABLA)
// ============================================================================

import React, { useEffect, useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { useNotificacion } from "@/context/NotificacionContext";

interface Invitado {
  nombre: string;
  rut: string;
  edad?: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (invitados: Invitado[]) => void;
  initial?: Invitado[];
  maxCantidad: number;
}

export default function ModalAsistentes({
  isOpen,
  onClose,
  onSave,
  initial = [],
  maxCantidad,
}: Props) {
  const [lista, setLista] = useState<Invitado[]>(initial);
  const { agregarNotificacion } = useNotificacion();

  useEffect(() => {
    setLista(initial);
  }, [initial]);

  if (!isOpen) return null;

  const addRow = () => {
    if (lista.length >= maxCantidad) {
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
      },
    ]);
  };

  const update = (index: number, field: keyof Invitado, value: string) => {
    setLista((prev) =>
      prev.map((inv, i) =>
        i === index
          ? {
              ...inv,
              [field]:
                field === "edad"
                  ? value === "" || value === null
                    ? undefined
                    : Number(value)
                  : value,
            }
          : inv
      )
    );
  };

  const remove = (index: number) => {
    setLista((prev) => prev.filter((_, i) => i !== index));
  };

  const guardar = () => {
    if (lista.length !== maxCantidad) {
      agregarNotificacion(
        `Debes registrar exactamente ${maxCantidad} asistente(s).`,
        "error"
      );
      return;
    }

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

    onSave(lista);
    onClose();
  };

  const canAddMore = lista.length < maxCantidad;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] px-4">
      <div
        className="
          bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6
          transform transition-all scale-100 animate-fadeIn
        "
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-enap-azul">
              Asistentes ({lista.length}/{maxCantidad})
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Completa la planilla con el nombre, RUT y edad (opcional).
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* CONTENEDOR FLEX PARA TABLA + FOOTER */}
        <div className="flex flex-col max-h-[65vh]">

          {/* TABLA / PLANILLA */}
          <div
            className="
              border border-gray-200 rounded-xl overflow-hidden
              bg-white flex-1 min-h-0
            "
          >
            <div className="overflow-y-auto max-h-full">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-10">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                      Nombre completo
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                      RUT
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 w-24">
                      Edad
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 w-16">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {lista.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center text-xs text-gray-400"
                      >
                        No hay asistentes aún. Añade filas para comenzar.
                      </td>
                    </tr>
                  )}

                  {lista.map((inv, index) => (
                    <tr
                      key={index}
                      className={`border-b last:border-b-0 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/60"
                      }`}
                    >
                      <td className="px-3 py-2 text-[13px] text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-3 py-2">
                        <input
                          className="
                            w-full border rounded-lg px-3 py-1.5 text-xs shadow-sm
                            focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
                          "
                          placeholder="Nombre completo"
                          value={inv.nombre}
                          onChange={(e) =>
                            update(index, "nombre", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-3 py-2">
                        <input
                          className="
                            w-full border rounded-lg px-3 py-1.5 text-xs shadow-sm
                            focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
                          "
                          placeholder="RUT"
                          value={inv.rut}
                          onChange={(e) =>
                            update(index, "rut", e.target.value)
                          }
                        />
                      </td>

                      <td className="px-3 py-2">
                        <input
                          className="
                            w-full border rounded-lg px-2 py-1.5 text-xs shadow-sm text-center
                            focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
                          "
                          placeholder="Edad"
                          type="number"
                          min={0}
                          max={120}
                          value={inv.edad ?? ""}
                          onChange={(e) =>
                            update(index, "edad", e.target.value)
                          }
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              index === lista.length - 1 &&
                              canAddMore
                            ) {
                              e.preventDefault();
                              addRow();
                            }
                          }}
                        />
                      </td>

                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => remove(index)}
                          className="
                            inline-flex items-center justify-center
                            text-red-600 hover:text-red-800 transition text-xs
                          "
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

          {/* FOOTER FIJO */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t bg-white">
            <button
              onClick={addRow}
              disabled={!canAddMore}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs
                ${
                  canAddMore
                    ? "bg-enap-cyan text-dark hover:bg-enap-azul transition"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <UserPlus size={16} /> Añadir fila
            </button>

            <button
              onClick={guardar}
              className="
                px-6 py-3 
                bg-[#003B4D] 
                text-white 
                rounded-xl 
                font-bold 
                text-[15px]
                shadow-lg
                hover:bg-[#005D73] 
                hover:shadow-xl 
                active:scale-[0.97]
                transition-all
              "
            >
              Guardar lista
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}