// src/modules/admin/tesoreria/components/TesoreriaKPIs.tsx
import React from "react";
import Card from "@/shared/ui/base/Card";

const CLP = new Intl.NumberFormat("es-CL");

interface Props {
  totalIngresos: number;
  totalMovimientos: number;
}

const TesoreriaKPIs: React.FC<Props> = ({
  totalIngresos,
  totalMovimientos,
}) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <p className="text-sm text-gray-500">Total ingresos</p>
        <p className="text-2xl font-bold text-enap-gold">
          ${CLP.format(totalIngresos)}
        </p>
      </Card>

      <Card>
        <p className="text-sm text-gray-500">Movimientos registrados</p>
        <p className="text-2xl font-bold">{totalMovimientos}</p>
      </Card>
    </div>
  );
};

export default TesoreriaKPIs;
