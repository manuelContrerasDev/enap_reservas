import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

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
  maxCantidad: number; // 👈 requerido para validación
}

export default function ModalAsistentes({
  isOpen,
  onClose,
  onSave,
  initial = [],
  maxCantidad,
}: Props) {
  const [lista, setLista] = useState<Invitado[]>(initial);

  useEffect(() => {
    setLista(initial);
  }, [initial]);

  if (!isOpen) return null;

  const addRow = () => {
    if (lista.length >= maxCantidad) return;
    setLista([...lista, { nombre: "", rut: "", edad: undefined }]);
  };

  const update = (index: number, field: string, value: any) => {
    const nueva = [...lista];
    (nueva[index] as any)[field] = value;
    setLista(nueva);
  };

  const remove = (index: number) => {
    setLista(lista.filter((_, i) => i !== index));
  };

  const guardar = () => {
    if (lista.length !== maxCantidad) {
      alert(`Debes registrar exactamente ${maxCantidad} invitados.`);
      return;
    }

    const invalido = lista.some(
      (i) => !i.nombre?.trim() || !i.rut?.trim()
    );

    if (invalido) {
      alert("Completa los datos de todos los invitados.");
      return;
    }

    onSave(lista);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Listado de Asistentes ({lista.length}/{maxCantidad})
          </h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {lista.map((inv, index) => (
            <div
              key={index}
              className="grid grid-cols-3 gap-3 items-center pb-2 border-b"
            >
              <input
                className="border p-2 rounded"
                placeholder="Nombre"
                value={inv.nombre}
                onChange={(e) => update(index, "nombre", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="RUT"
                value={inv.rut}
                onChange={(e) => update(index, "rut", e.target.value)}
              />

              <input
                className="border p-2 rounded"
                placeholder="Edad"
                type="number"
                value={inv.edad ?? ""}
                onChange={(e) => update(index, "edad", Number(e.target.value))}
              />

              <button
                className="col-span-3 text-red-600 text-sm mt-1"
                onClick={() => remove(index)}
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={addRow}
            disabled={lista.length >= maxCantidad}
          >
            Agregar persona
          </button>

          <button
            onClick={guardar}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
