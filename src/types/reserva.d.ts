export type EstadoReserva =
  | "pendiente"
  | "confirmada"
  | "cancelada"
  | "rechazada";

export interface Reserva {
  id: string;
  usuario: string;            // nombre socio
  espacioNombre: string;      // nombre del espacio
  fechaInicio: string;
  fechaFin: string;
  personas: number;
  estado: EstadoReserva;
  total: number;
}
