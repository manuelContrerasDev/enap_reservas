// src/modules/reservas/components/modals/ModalEditarInvitados.tsx
import React, { useMemo, useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import type { ReservaFrontend } from "@/types/ReservaFrontend";
import { useNotificacion } from "@/context/NotificacionContext";

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

function tempId() {
  // fallback seguro (no depende de crypto)
  return `tmp_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function ModalEditarInvitados({
  reserva,
  loading = false,
  onClose,
  onGuardar,
}: Props) {
  const { agregarNotificacion } = useNotificacion();

  const maxCantidad = reserva.cantidadPersonas ?? 0;
  // si el backend usa cantidadPiscina como “declarados piscina”
  const maxPiscina = reserva.cantidadPiscina ?? 0;

  const [invitados, setInvitados] = useState<InvitadoForm[]>(
    (reserva.invitados ?? []).map((i) => ({ ...i }))
  );

  const piscinaMarcados = useMemo(
    () => invitados.filter((i) => Boolean(i.esPiscina)).length,
    [invitados]
  );

  const actualizar = (id: string, campo: keyof InvitadoForm, valor: any) => {
    setInvitados((prev) => prev.map((inv) => (inv.id === id ? { ...inv, [campo]: valor } : inv)));
  };

  const agregarInvitado = () => {
    if (invitados.length >= maxCantidad) {
      agregarNotificacion(`Debes mantener exactamente ${maxCantidad} invitado(s).`, "info");
      return;
    }

    setInvitados((prev) => [
      ...prev,
      { id: tempId(), nombre: "", rut: "", edad: null, esPiscina: false },
    ]);
  };

  const eliminarInvitado = (id: string) => {
    if (invitados.length <= 0) return;
    setInvitados((prev) => prev.filter((i) => i.id !== id));
  };

  const validarAntesDeGuardar = () => {
    if (invitados.length !== maxCantidad) {
      agregarNotificacion(`Debes registrar exactamente ${maxCantidad} invitado(s).`, "error");
      return false;
    }

    const invalid = invitados.some((i) => !i.nombre.trim() || !i.rut.trim());
    if (invalid) {
      agregarNotificacion("Todos los invitados deben tener nombre y RUT.", "error");
      return false;
    }

    if (piscinaMarcados > maxPiscina) {
      agregarNotificacion(
        `Marcaste ${piscinaMarcados} para piscina, pero declaraste ${maxPiscina}.`,
        "error"
      );
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarAntesDeGuardar()) return;
    await onGuardar(invitados);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#002E3E]">Editar Invitados</h2>
            <p className="text-xs text-gray-600 mt-1">
              Debes mantener exactamente {maxCantidad}. Esto no modifica el monto.
            </p>
            {maxPiscina > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Piscina: {piscinaMarcados}/{maxPiscina} marcados.
              </p>
            )}
          </div>

          <button onClick={onClose} aria-label="Cerrar">
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </header>

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
                onChange={(e) => actualizar(inv.id, "nombre", e.target.value)}
              />

              <input
                className="col-span-3 border rounded px-2 py-1 text-sm"
                placeholder="RUT"
                value={inv.rut}
                onChange={(e) => actualizar(inv.id, "rut", e.target.value)}
              />

              <input
                type="number"
                className="col-span-2 border rounded px-2 py-1 text-sm"
                placeholder="Edad"
                value={inv.edad ?? ""}
                onChange={(e) =>
                  actualizar(inv.id, "edad", e.target.value === "" ? null : Number(e.target.value))
                }
              />

              <label className="col-span-2 flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={Boolean(inv.esPiscina)}
                  onChange={(e) => actualizar(inv.id, "esPiscina", e.target.checked)}
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

        <button
          onClick={agregarInvitado}
          className="flex items-center gap-2 text-sm text-[#002E3E] font-semibold"
        >
          <Plus size={16} />
          Agregar invitado
        </button>

        <footer className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-sm">
            Cerrar
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
