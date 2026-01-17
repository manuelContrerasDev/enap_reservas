// src/types/ReservaDTO.ts
import { ReservaEstado } from "@/shared/types/enums";

export interface InvitadoDTO {
  id: string;
  nombre: string;
  rut: string;
  edad?: number | null;
  esPiscina?: boolean;
}

export interface ReservaDTO {
  id: string;

  espacio: {
    id: string | null;
    nombre: string | null;
    tipo: string | null;
    capacidad: number | null;
  };

  fechaInicio: string;
  fechaFin: string;
  dias: number;

  estado: ReservaEstado;
  totalClp: number;

  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadPiscina: number;

  snapshot: {
    precioBase: number | null;
    precioPersona: number | null;
    precioPiscina: number | null;
  };

  socio: {
    nombre: string;
    rut: string;
    telefono: string;
    correoEnap: string;
    correoPersonal: string | null;
  };

  usoReserva: "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";
  socioPresente: boolean;

  responsable: null | {
    nombre: string | null;
    rut: string | null;
    email: string | null;
  };

  invitados: InvitadoDTO[];

  // 🔥 NUEVO
  comprobanteUrl?: string | null;

  pago: null | {
    id: string;
    status: "CREATED" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    buyOrder: string;
    token: string | null;
    amountClp: number;
    transactionDate: string | null;
    rawResponse: any;
  };
}
