// src/types/ReservaFrontend.ts

import { ReservaEstado } from "@/types/enums";

export interface InvitadoFrontend {
  id: string;
  nombre: string;
  rut?: string | null;
  edad?: number | null;
}

export interface ReservaFrontend {
  id: string;

  espacioId: string;
  espacioNombre: string;
  espacioTipo: string;

  fechaInicio: string;
  fechaFin: string;

  dias: number;
  cantidadPersonas: number;
  totalClp: number;

  estado: ReservaEstado;

  usuario: {
    id: string;
    nombre: string;
    email: string;
  };

  // 👇🔥 NUEVO, obligatorio
  invitados: InvitadoFrontend[];
}
