// ============================================================
// Contrato oficial Reserva Manual — Admin → Backend (ENAP)
// ============================================================

// Payload que envía el formulario Admin -> Backend
// ============================================================
// Contrato oficial Reserva Manual — Admin → Backend (ENAP 2025)
// ============================================================

export interface ReservaManualBackendPayload {
  // Identidad
  userId: string;
  creadaPor: string;
  espacioId: string;

  // Fechas
  fechaInicio: string;
  fechaFin: string;

  // Cantidades
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadPiscina: number;

  // Negocio
  usoReserva: "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";
  marcarPagada?: boolean;

  // Regla ENAP REAL
  socioPresente: boolean;

  // Titular de la reserva
  socio: {
    nombre: string;
    rut: string;
    telefono: string;
    correoEnap: string;
    correoPersonal?: string | null;
  };

  // Responsable (SOLO si socioPresente === false)
  responsable?: {
    nombre: string;
    rut: string;
    email?: string;
    telefono?: string;
  } | null;
}


// ============================================================
// Respuesta Backend
// ============================================================

// ============================================================
// Respuesta Backend — Reserva Manual
// ============================================================

export interface ReservaManualResult {
  id: string;
  userId: string;
  espacioId: string;

  fechaInicio: string;
  fechaFin: string;
  totalClp: number;

  estado:
    | "PENDIENTE_PAGO"
    | "CONFIRMADA"
    | "CANCELADA"
    | "RECHAZADA"
    | "FINALIZADA";

  espacio: {
    id: string;
    nombre: string;
    tipo: string;
  };

  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

