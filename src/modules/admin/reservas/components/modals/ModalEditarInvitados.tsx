import React, { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import type { ReservaFrontend } from "@/types/BuscarReservaFrontend";

type InvitadoForm = {
  id: string;
  nombre: string;
  rut: string;
  edad?: number | null;
  esPiscina?: boolean;
};

interface Props {
  reserva: ReservaFrontend;
  loading?: boolean;
  onClose: () => void;
  onGuardar: (invitados: InvitadoForm[]) => Promise<void>;
}

export default function ModalEditarInvitados({
  reserva,
  loading = false,
  onClose,
  onGuardar,
}: Props) {
  const [invitados, setInvitados] = useState<InvitadoForm[]>(
    reserva.invitados.map((i) => ({ ...i }))
  );

  const actualizar = (
    id: string,
    campo: keyof InvitadoForm,
    valor: any
  ) => {
    setInvitados((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, [campo]: valor } : inv
      )
    );
  };

  const agregarInvitado = () => {
    setInvitados((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(), // 🔥 id temporal seguro
        nombre: "",
        rut: "",
        edad: null,
        esPiscina: false,
      },
    ]);
  };

  const eliminarInvitado = (id: string) => {
    setInvitados((prev) => prev.filter((i) => i.id !== id));
  };

  const handleGuardar = async () => {
    await onGuardar(invitados);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 space-y-6">

        {/* HEADER */}
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#002E3E]">
            Editar Invitados
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </header>

        {/* INFO */}
        <p className="text-sm text-gray-600">
          Puedes modificar la lista de invitados antes del inicio de la reserva.
          Esto no afecta fechas ni montos.
        </p>

        {/* LISTA */}
        <div className="space-y-4 max-h-[55vh] overflow-y-auto">
          {invitados.map((inv) => (
            <div
              key={inv.id}
              className="grid grid-cols-12 gap-3 items-center border rounded-lg p-3"
            >
              <input
                className="col-span-4 border rounded px-2 py-1 text-sm"
                placeholder="Nombre"
                value={inv.nombre}
                onChange={(e) =>
                  actualizar(inv.id, "nombre", e.target.value)
                }
              />

              <input
                className="col-span-3 border rounded px-2 py-1 text-sm"
                placeholder="RUT"
                value={inv.rut}
                onChange={(e) =>
                  actualizar(inv.id, "rut", e.target.value)
                }
              />

              <input
                type="number"
                className="col-span-2 border rounded px-2 py-1 text-sm"
                placeholder="Edad"
                value={inv.edad ?? ""}
                onChange={(e) =>
                  actualizar(
                    inv.id,
                    "edad",
                    e.target.value === "" ? null : Number(e.target.value)
                  )
                }
              />

              <label className="col-span-2 flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={inv.esPiscina ?? false}
                  onChange={(e) =>
                    actualizar(inv.id, "esPiscina", e.target.checked)
                  }
                />
                Piscina
              </label>

              <button
                onClick={() => eliminarInvitado(inv.id)}
                className="col-span-1 text-red-500 hover:text-red-700"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* AGREGAR */}
        <button
          onClick={agregarInvitado}
          className="flex items-center gap-2 text-sm text-[#002E3E] font-semibold"
        >
          <Plus size={16} />
          Agregar invitado
        </button>

        {/* FOOTER */}
        <footer className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-[#002E3E] text-white text-sm font-semibold hover:bg-[#01384A] flex items-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Guardar cambios
          </button>
        </footer>
      </div>
    </div>
  );
}
