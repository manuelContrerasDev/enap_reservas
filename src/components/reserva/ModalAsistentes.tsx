import React, { useState } from "react";
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
}

export default function ModalAsistentes({
  isOpen,
  onClose,
  onSave,
  initial = [],
}: Props) {
  const [lista, setLista] = useState<Invitado[]>(initial);

  if (!isOpen) return null;

  const addRow = () => {
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
    onSave(lista);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Listado de Asistentes</h2>
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
