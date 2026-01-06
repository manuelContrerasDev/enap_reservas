// src/services/adminReservaService.ts
import { api } from "@/lib/api";
import { ApiResponse } from "@/types/api";
import {
  ReservaManualBackendPayload,
  ReservaManualResult,
} from "@/types/admin/reservaManualBackend";

export const adminReservaService = {
  async crearManual(
    payload: ReservaManualBackendPayload
  ): Promise<ApiResponse<ReservaManualResult>> {
    try {
      const res = await api.post<{ reserva: ReservaManualResult }>(
        "/admin/reservas/manual",
        payload
      );

      return {
        ok: true,
        data: res.data.reserva,
      };
    } catch (err: any) {
      console.error("❌ Error crearManual:", err);

      return {
        ok: false,
        error:
          err?.response?.data?.error ??
          err?.message ??
          "Error desconocido al crear reserva",
      };
    }
  },

  async listar(): Promise<ApiResponse<ReservaManualResult[]>> {
    try {
      const res = await api.get<{ reservas: ReservaManualResult[] }>(
        "/admin/reservas"
      );

      return {
        ok: true,
        data: res.data.reservas,
      };
    } catch (err: any) {
      console.error("❌ Error listar reservas admin:", err);

      return {
        ok: false,
        error:
          err?.response?.data?.error ??
          err?.message ??
          "Error al cargar reservas",
      };
    }
  },
};
