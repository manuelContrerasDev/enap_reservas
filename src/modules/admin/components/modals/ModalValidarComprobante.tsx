import React, { useEffect, useState } from "react";
import Modal from "@/shared/ui/base/Modal";
import Button from "@/shared/ui/base/Button";
import Input from "@/shared/ui/base/Input";

import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";

interface Props {
  open: boolean;
  reserva: ReservaFrontend | null;
  onClose: () => void;

  onAprobar: (
    reservaId: string,
    payload?: {
      monto?: number;
      referencia?: string;
      nota?: string;
    }
  ) => Promise<void>;

  onRechazar: (
    reservaId: string,
    payload: {
      motivo: string;
    }
  ) => Promise<void>;
}

type Modo = "APROBAR" | "RECHAZAR" | null;

const ModalValidarComprobante: React.FC<Props> = ({
  open,
  reserva,
  onClose,
  onAprobar,
  onRechazar,
}) => {
  const [loading, setLoading] = useState(false);
  const [modo, setModo] = useState<Modo>(null);

  const [monto, setMonto] = useState("");
  const [referencia, setReferencia] = useState("");
  const [nota, setNota] = useState("");
  const [motivo, setMotivo] = useState("");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setModo(null);
      setError(null);
      setMonto("");
      setReferencia("");
      setNota("");
      setMotivo("");
      setLoading(false);
    }
  }, [open]);

  if (!reserva) return null;

  const validarAprobacion = () => {
    if (monto) {
      const n = Number(monto);
      if (!Number.isFinite(n) || n <= 0) {
        return "El monto debe ser un número mayor a 0";
      }
    }
    return null;
  };

  const handleAprobar = async () => {
    const err = validarAprobacion();
    if (err) return setError(err);

    try {
      setLoading(true);
      await onAprobar(reserva.id, {
        monto: monto ? Math.trunc(Number(monto)) : undefined,
        referencia: referencia.trim() || undefined,
        nota: nota.trim() || undefined,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Error al aprobar el pago");
    } finally {
      setLoading(false);
    }
  };

  const handleRechazar = async () => {
    if (!motivo.trim()) {
      return setError("Debes indicar un motivo del rechazo");
    }

    try {
      setLoading(true);
      await onRechazar(reserva.id, { motivo: motivo.trim() });
      onClose();
    } catch (e: any) {
      setError(e?.message || "Error al rechazar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title="Validar comprobante de pago"
    >
      <div className="space-y-6">
        <div className="text-sm text-gray-700">
          <p><strong>Reserva:</strong> {reserva.espacioNombre}</p>
          <p><strong>Socio:</strong> {reserva.socio.nombre}</p>
          <p>
            <strong>Total:</strong>{" "}
            <span className="font-semibold text-enap-gold">
              ${reserva.totalClp.toLocaleString("es-CL")}
            </span>
          </p>
        </div>

        {!modo && (
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cerrar
            </Button>
            <Button variant="outline" onClick={() => setModo("RECHAZAR")}>
              Rechazar pago
            </Button>
            <Button
              variant="primary"
              onClick={() => setModo("APROBAR")}
              disabled={!reserva.comprobanteUrl}
            >
              Aprobar pago
            </Button>
          </div>
        )}

        {modo === "APROBAR" && (
          <>
            <Input
              type="number"
              placeholder={reserva.totalClp.toString()}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
            />
            <Input
              placeholder="Referencia / folio"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
            />
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              rows={3}
              placeholder="Nota interna"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModo(null)} disabled={loading}>
                Volver
              </Button>
              <Button variant="primary" onClick={handleAprobar} disabled={loading}>
                {loading ? "Aprobando..." : "Confirmar pago"}
              </Button>
            </div>
          </>
        )}

        {modo === "RECHAZAR" && (
          <>
            <textarea
              className="w-full rounded border px-3 py-2 text-sm"
              rows={3}
              placeholder="Motivo del rechazo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModo(null)} disabled={loading}>
                Volver
              </Button>
              <Button variant="primary" onClick={handleRechazar} disabled={loading}>
                {loading ? "Rechazando..." : "Confirmar rechazo"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalValidarComprobante;
