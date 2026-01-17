// src/modules/espacios/helpers/resolverPrecio.ts
import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import type { UserRole } from "@/modules/auth/types/auth.types";

export function resolverPrecioPorRol(
  espacio: EspacioDTO,
  role: UserRole | null
): number {
  if (role === "EXTERNO") return espacio.precioBaseExterno;
  return espacio.precioBaseSocio; // SOCIO y ADMIN
}
