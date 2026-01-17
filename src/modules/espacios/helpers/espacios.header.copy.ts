// src/modules/espacios/helpers/espacios.header.copy.ts
import type { UserRole } from "@/modules/auth/types/auth.types";

interface HeaderCopy {
  etiqueta: string;
  descripcion: string;
}

export function getEspaciosHeaderCopy(
  role: UserRole | null
): HeaderCopy {
  switch (role) {
    case "SOCIO":
      return {
        etiqueta: "Beneficios para Socios",
        descripcion:
          "Accede a tarifas preferenciales y reserva cabañas, quinchos y piscina según tus beneficios como socio.",
      };

    case "EXTERNO":
      return {
        etiqueta: "Acceso Usuarios Externos",
        descripcion:
          "Explora los espacios disponibles del centro recreativo y revisa las tarifas para usuarios externos.",
      };

    default:
      return {
        etiqueta: "Catálogo de Espacios",
        descripcion:
          "Explora los espacios disponibles del centro recreativo.",
      };
  }
}
