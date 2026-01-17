import React, { useMemo, useState } from "react";
import Modal from "@/shared/ui/base/Modal";
import Input from "@/shared/ui/base/Input";
import Button from "@/shared/ui/base/Button";
import Select from "@/shared/ui/base/Select";

import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";

interface Props {
  open: boolean;
  reserva: ReservaFrontend | null;
  onClose: () => void;
  onSubmit: (payload: {
    comprobanteUrl: string;
    comprobanteName: string;
    comprobanteMime: string;
    comprobanteSize: number;
  }) => Promise<void>;
}

const ALLOWED_MIME = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

function inferMimeFromUrl(url: string): string | null {
  const lower = url.toLowerCase();
  if (lower.includes(".pdf")) return "application/pdf";
  if (lower.includes(".png")) return "image/png";
  if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
  if (lower.includes(".webp")) return "image/webp";
  return null;
}

function inferNameFromUrl(url: string): string {
  try {
    const clean = url.split("?")[0];
    const last = clean.split("/").pop() || "comprobante";
    return last.length > 2 ? last : "comprobante";
  } catch {
    return "comprobante";
  }
}

const ModalSubirComprobante: React.FC<Props> = ({
  open,
  reserva,
  onClose,
  onSubmit,
}) => {
  const [url, setUrl] = useState("");
  const [mime, setMime] = useState<string>("application/pdf");
  const [name, setName] = useState<string>("comprobante");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inferred = useMemo(() => inferMimeFromUrl(url.trim()), [url]);

  if (!reserva) return null;

  const handleSubmit = async () => {
    const value = url.trim();

    if (!value) {
      setError("Debes ingresar la URL del comprobante.");
      return;
    }

    // Si la url sugiere mime válido, lo aceptamos.
    // Si no, exigimos que el admin seleccione uno válido manualmente.
    const mimeFinal = inferred ?? mime;

    if (!ALLOWED_MIME.includes(mimeFinal as any)) {
      setError("Formato no permitido. Usa PDF, PNG, JPG/JPEG o WEBP.");
      return;
    }

    const nameFinal = (name.trim() || inferNameFromUrl(value)).trim();

    try {
      setLoading(true);
      setError(null);

      await onSubmit({
        comprobanteUrl: value,
        comprobanteName: nameFinal,
        comprobanteMime: mimeFinal,
        comprobanteSize: 0, // URL externa, tamaño desconocido
      });

      setUrl("");
      setName("comprobante");
      setMime("application/pdf");
      onClose();
    } catch (e: any) {
      setError(e?.message || "Error al subir comprobante");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Subir comprobante de pago">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Reserva: <strong>{reserva.espacioNombre}</strong>
        </p>

        <p className="text-sm text-gray-600">
          📌 Este comprobante quedará <strong>pendiente de validación</strong> por administración
          antes de confirmar la reserva.
        </p>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            URL del comprobante (Drive / enlace)
          </label>

          <Input
            type="url"
            placeholder="https://drive.google.com/..."
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);

              // Auto-inferir nombre/mime cuando se pueda
              const maybeName = inferNameFromUrl(e.target.value);
              if (maybeName && maybeName !== "comprobante") setName(maybeName);

              const maybeMime = inferMimeFromUrl(e.target.value);
              if (maybeMime) setMime(maybeMime);
            }}
            error={!!error}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Nombre (referencia)
            </label>
            <Input
              placeholder="Ej: transferencia_enero_2026.pdf"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              error={!!error}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Tipo de archivo
            </label>
            <Select
              value={mime}
              onChange={(e) => {
                setMime(e.target.value);
                if (error) setError(null);
              }}
              className="text-sm"
            >
              <option value="application/pdf">PDF</option>
              <option value="image/png">PNG</option>
              <option value="image/jpeg">JPG / JPEG</option>
              <option value="image/webp">WEBP</option>
            </Select>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Subiendo..." : "Guardar comprobante"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSubirComprobante;
