
/*
// src/types/auth.d.ts
export type UserRole = "cliente" | "ejecutivo" | "admin" | null;

interface AuthContextType {
  userRole: UserRole | null;
  userName: string | null;
  login: (nombre: string, password: string) => boolean;
  logout: () => void;
}


interface ReservaContextType {
  reservas: Reserva[];
  reservaActual: ReservaFormData | null;
  loading: boolean;
  setReservaActual: (reserva: ReservaFormData | null) => void;
  agregarReserva: (usuario: string) => Promise<boolean>;
  actualizarEstado: (id: string, nuevoEstado: Estado) => Promise<void>;
  eliminarReserva: (id: string) => Promise<void>; // ✅ NUEVO
  cargarReservas: () => Promise<void>;
}
*/
