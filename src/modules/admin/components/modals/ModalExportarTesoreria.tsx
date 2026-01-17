import React, { useState } from "react";
import Modal from "@/shared/ui/base/Modal";
import Button from "@/shared/ui/base/Button";

interface Props {
  open: boolean;
  onClose: () => void;
  onExportExcel: () => void;
  filtros: {
    desde?: string;
    hasta?: string;
  };
}

const ModalExportarTesoreria: React.FC<Props> = ({
  open,
  onClose,
  onExportExcel,
  filtros,
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    onExportExcel();
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <Modal open={open} onClose={onClose} title="Exportar Tesorería">
      <div className="space-y-4 text-sm">
        <p className="text-gray-600">
          Estás a punto de exportar los movimientos financieros con los siguientes
          filtros:
        </p>

        <div className="rounded border bg-gray-50 p-3 space-y-1">
          <p>
            <strong>Desde:</strong>{" "}
            {filtros.desde || "Inicio"}
          </p>
          <p>
            <strong>Hasta:</strong>{" "}
            {filtros.hasta || "Hoy"}
          </p>
        </div>

        <p className="text-xs text-gray-500">
          El archivo contendrá información financiera sensible.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? "Exportando..." : "Exportar Excel"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalExportarTesoreria;
