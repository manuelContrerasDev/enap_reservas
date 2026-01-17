// src/modules/admin/tesoreria/components/TesoreriaTable.tsx
import React from "react";
import Card from "@/shared/ui/base/Card";

const CLP = new Intl.NumberFormat("es-CL");
const DATE = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "short",
  timeStyle: "short",
});

interface Props {
  rows: any[];
}

const TesoreriaTable: React.FC<Props> = ({ rows }) => {
  return (
    <Card className="p-0 overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-enap-primary text-white">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Reserva</th>
            <th className="px-4 py-3">Socio</th>
            <th className="px-4 py-3">Espacio</th>
            <th className="px-4 py-3 text-right">Monto</th>
            <th className="px-4 py-3">Referencia</th>
            <th className="px-4 py-3">Admin</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {rows.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                {DATE.format(new Date(m.createdAt))}
              </td>
              <td className="px-4 py-3">{m.reserva.id}</td>
              <td className="px-4 py-3">{m.reserva.nombreSocio}</td>
              <td className="px-4 py-3">{m.reserva.espacio.nombre}</td>
              <td className="px-4 py-3 text-right font-semibold text-enap-gold">
                ${CLP.format(m.montoClp)}
              </td>
              <td className="px-4 py-3">
                {m.referencia || "—"}
              </td>
              <td className="px-4 py-3 text-xs">
                {m.creadoPor.name || m.creadoPor.email}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default TesoreriaTable;
