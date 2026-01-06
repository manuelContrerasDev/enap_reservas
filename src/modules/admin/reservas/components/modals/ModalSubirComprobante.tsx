import React, { useState } from "react";
import Modal from "@/components/ui/base/Modal";
import Input from "@/components/ui/base/Input";
import Button from "@/components/ui/base/Button";

import type { ReservaFrontend } from "@/types/ReservaFrontend";

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

const ModalSubirComprobante: React.FC<Props> = ({
  open,
  reserva,
  onClose,
  onSubmit,
}) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reserva) return null;

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError("Debes ingresar la URL del comprobante");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await onSubmit({
        comprobanteUrl: url.trim(),
        comprobanteName: "comprobante-drive",
        comprobanteMime: "text/url",
        comprobanteSize: 0,
      });

      setUrl("");
      onClose();
    } catch (e: any) {
      setError(e.message || "Error al subir comprobante");
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

        {/* LABEL EXTERNO (Input NO acepta label) */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            URL del comprobante (Drive)
          </label>

          <Input
            type="url"
            placeholder="https://drive.google.com/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={!!error}
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Subiendo..." : "Confirmar comprobante"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSubirComprobante;
