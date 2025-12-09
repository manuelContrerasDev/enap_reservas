import { useState } from "react";
import { adminReservaService } from "@/services/adminReservaService";
import { ReservaManualBackendPayload, ReservaManualResult } from "@/types/reservaManualBackend";

export const useReservaManual = () => {
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<ReservaManualResult | null>(null);

  const crear = async (payload: ReservaManualBackendPayload) => {
    setLoading(true);
    const res = await adminReservaService.crearManual(payload);
    setLoading(false);

    if (res.ok && res.data) {
      setResultado(res.data);
    }

    return res;
  };

  return {
    loading,
    resultado,
    crear,
  };

  
};
