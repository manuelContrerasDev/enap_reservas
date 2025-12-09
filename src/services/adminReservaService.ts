import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  ReservaManualBackendPayload,
  ReservaManualResult,
} from "@/types/reservaManualBackend";

export const adminReservaService = {
  async crearManual(
    payload: ReservaManualBackendPayload
  ): Promise<ApiResponse<ReservaManualResult>> {
    try {
      // 🔥 Tipamos la respuesta del backend aquí
      const res = await api.post<{ reserva: ReservaManualResult }>(
        "/admin/reservas/manual",
        payload
      );

      return {
        ok: true,
        data: res.data.reserva,
      };
    } catch (err: any) {
      return {
        ok: false,
        error: err.response?.data?.error ?? "Error desconocido",
      };
    }
  },

  async listar(): Promise<ApiResponse<ReservaManualResult[]>> {
    try {
      // 🔥 Tipamos la estructura exacta
      const res = await api.get<{ reservas: ReservaManualResult[] }>(
        "/admin/reservas"
      );

      return {
        ok: true,
        data: res.data.reservas,
      };
    } catch (err: any) {
      return {
        ok: false,
        error: err.response?.data?.error ?? "Error al cargar reservas",
      };
    }
  },
};
