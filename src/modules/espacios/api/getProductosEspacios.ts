// src/modules/espacios/api/getProductosEspacios.ts
import { http } from "@/shared/api/http";
import type { ProductoEspacioDTO } from "@/modules/espacios/types/ProductoEspacioDTO";

export async function getProductosEspacios(): Promise<ProductoEspacioDTO[]> {
  const { data } = await http.get<ProductoEspacioDTO[]>(
    "/api/espacios/productos"
  );

  return data;
}
