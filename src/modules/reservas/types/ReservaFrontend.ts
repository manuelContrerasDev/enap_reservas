// src/types/ReservaFrontend.ts
import {
  ReservaEstado,
  TipoEspacio,
  UsoReserva,
} from "@/shared/types/enums";

export type ReservaFrontend = {
  id: string;

  // Espacio
  espacioId: string | null;
  espacioNombre: string;
  espacioTipo: TipoEspacio | null;

  // Fechas
  fechaInicio: string;
  fechaFin: string;
  dias: number;

  // Estado
  estado: ReservaEstado;
  totalClp: number;

  // Cantidades
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadPiscina: number;
  cantidadPersonas: number;

  // Socio
  socio: {
    nombre: string;
    rut: string;
    telefono: string;
    correoEnap: string;
    correoPersonal: string | null;
  };

  usoReserva: UsoReserva;
  socioPresente: boolean;

  responsable: {
    nombre: string | null;
    rut: string | null;
    email: string | null;
    telefono: string | null;
  };

  invitados: {
    id: string;
    nombre: string;
    rut: string;
    edad?: number | null;
    esPiscina: boolean;
  }[];

  snapshot: {
    precioBase: number;
    precioPersona: number;
    precioPiscina: number;
  };

  // 🔥 NUEVO — PAGO MANUAL
  comprobanteUrl?: string | null;

  pago: null | {
    id: string;
    status: "CREATED" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
    amountClp: number;
    buyOrder: string;
    token: string | null;
    transactionDate: string | null;
  };
};
