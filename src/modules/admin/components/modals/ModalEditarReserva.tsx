import React, { useState, useMemo } from "react";
import { X, Loader2, AlertTriangle } from "lucide-react";
import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";
import { UsoReserva } from "@/shared/types/enums";

interface Props {
  reserva: ReservaFrontend;
  loading?: boolean;
  onClose: () => void;
  onGuardar: (payload: {
    nombreSocio?: string;
    telefonoSocio?: string;
    correoPersonal?: string | null;
    usoReserva?: UsoReserva;
    socioPresente?: boolean;
    nombreResponsable?: string | null;
    rutResponsable?: string | null;
    emailResponsable?: string | null;
    telefonoResponsable?: string | null;
  }) => Promise<void>;
}

export default function ModalEditarReserva({
  reserva,
  loading = false,
  onClose,
  onGuardar,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nombreSocio: reserva.socio.nombre,
    telefonoSocio: reserva.socio.telefono,
    correoPersonal: reserva.socio.correoPersonal ?? "",
    usoReserva: reserva.usoReserva,
    socioPresente: reserva.socioPresente,

    nombreResponsable: reserva.responsable?.nombre ?? "",
    rutResponsable: reserva.responsable?.rut ?? "",
    emailResponsable: reserva.responsable?.email ?? "",
    telefonoResponsable: "",
  });

  const update = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  /* ============================================================
   * 🔎 VALIDACIONES DE NEGOCIO
   * ============================================================ */
  const requiereResponsable = useMemo(() => {
    return (
      form.usoReserva === UsoReserva.TERCEROS ||
      (form.usoReserva === UsoReserva.CARGA_DIRECTA && !form.socioPresente)
    );
  }, [form.usoReserva, form.socioPresente]);

  const esValido = useMemo(() => {
    if (!form.nombreSocio.trim()) return false;
    if (!form.telefonoSocio.trim()) return false;

    if (requiereResponsable) {
      if (!form.nombreResponsable.trim()) return false;
      if (!form.rutResponsable.trim()) return false;
    }

    return true;
  }, [form, requiereResponsable]);

  /* ============================================================
   * 💾 GUARDAR
   * ============================================================ */
  const handleGuardar = async () => {
    if (!esValido) {
      setError(
        "Faltan datos obligatorios. Revisa socio y responsable antes de guardar."
      );
      return;
    }

    await onGuardar({
      nombreSocio: form.nombreSocio.trim(),
      telefonoSocio: form.telefonoSocio.trim(),
      correoPersonal: form.correoPersonal || null,

      usoReserva: form.usoReserva,
      socioPresente:
        form.usoReserva === UsoReserva.USO_PERSONAL
          ? true
          : form.socioPresente,

      ...(requiereResponsable
        ? {
            nombreResponsable: form.nombreResponsable.trim(),
            rutResponsable: form.rutResponsable.trim(),
            emailResponsable: form.emailResponsable || null,
            telefonoResponsable: form.telefonoResponsable || null,
          }
        : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-6 space-y-6">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#002E3E]">
            Editar datos de la reserva
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700" />
          </button>
        </header>

        <p className="text-sm text-gray-600">
          Solo se permiten correcciones administrativas. No se modifican fechas
          ni montos.
        </p>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* SOCIO */}
        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Nombre socio"
            value={form.nombreSocio}
            onChange={(e) => update("nombreSocio", e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Teléfono socio"
            value={form.telefonoSocio}
            onChange={(e) => update("telefonoSocio", e.target.value)}
          />

          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Correo personal"
            value={form.correoPersonal}
            onChange={(e) => update("correoPersonal", e.target.value)}
          />

          <select
            className="w-full border rounded px-3 py-2 text-sm"
            value={form.usoReserva}
            onChange={(e) =>
              update("usoReserva", e.target.value as UsoReserva)
            }
          >
            <option value={UsoReserva.USO_PERSONAL}>Uso personal</option>
            <option value={UsoReserva.CARGA_DIRECTA}>Carga directa</option>
            <option value={UsoReserva.TERCEROS}>Terceros</option>
          </select>

          {form.usoReserva !== UsoReserva.USO_PERSONAL && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.socioPresente}
                onChange={(e) =>
                  update("socioPresente", e.target.checked)
                }
              />
              Socio presente
            </label>
          )}
        </div>

        {/* RESPONSABLE */}
        {requiereResponsable && (
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">
              Responsable a cargo
            </h4>

            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Nombre responsable"
              value={form.nombreResponsable}
              onChange={(e) =>
                update("nombreResponsable", e.target.value)
              }
            />

            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="RUT responsable"
              value={form.rutResponsable}
              onChange={(e) =>
                update("rutResponsable", e.target.value)
              }
            />

            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Email responsable"
              value={form.emailResponsable}
              onChange={(e) =>
                update("emailResponsable", e.target.value)
              }
            />
          </div>
        )}

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
            disabled={loading || !esValido}
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
