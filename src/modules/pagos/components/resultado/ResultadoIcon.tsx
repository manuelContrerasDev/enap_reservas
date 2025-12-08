// src/modules/pagos/resultado/ResultadoIcon.tsx

import React from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ResultadoIconProps {
  estado: "approved" | "rejected" | "cancelled" | "error";
  size?: number; // opcional para escalabilidad
}

export default function ResultadoIcon({
  estado,
  size = 72,
}: ResultadoIconProps) {
  switch (estado) {
    case "approved":
      return (
        <CheckCircle
          size={size}
          className="text-green-600 mx-auto"
        />
      );

    case "rejected":
      return (
        <XCircle
          size={size}
          className="text-red-500 mx-auto"
        />
      );

    case "cancelled":
      return (
        <XCircle
          size={size}
          className="text-yellow-500 mx-auto"
        />
      );

    case "error":
    default:
      return (
        <AlertTriangle
          size={size}
          className="text-red-600 mx-auto"
        />
      );
  }
}
