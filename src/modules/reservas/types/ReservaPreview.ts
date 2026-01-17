// src/types/ReservaPreview.ts
import type { TipoEspacio, UsoReserva } from "@/shared/types/enums";

export interface ReservaPreview {
  // Espacio
  espacioId: string;
  espacioNombre: string;
  espacioTipo?: TipoEspacio | null;

  // Fechas
  fechaInicio: string;
  fechaFin: string;
  dias: number;

  // Cantidades
  cantidadPersonas: number;

  // Socio (snapshot)
  socio: {
    nombre: string;
    rut: string;
    telefono: string;
    correoEnap: string;
    correoPersonal: string | null;
  };

  // Uso
  usoReserva: UsoReserva;
  socioPresente: boolean;

  // Responsable (solo si socioPresente=false)
  responsable: {
    nombre: string | null;
    rut: string | null;
    email: string | null;
  };

  // Invitados
  invitados: {
    nombre: string;
    rut: string;
    edad?: number | null;
    esPiscina: boolean;
  }[];

  // Totales (preview)
  totales: {
    valorEspacio: number;
    pagoPersonas: number;
    pagoPiscina: number;
    total: number;
  };
}
