import { http } from "@/shared/api/http";
import type { EspacioDTO } from "@/types/espacios";

export function getEspacios() {
  return http<EspacioDTO[]>("/api/espacios");
}
