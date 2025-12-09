// Payload que envía el formulario Admin -> Backend

export interface ReservaManualBackendPayload {
  userId: string;
  espacioId: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadPiscina: number;
  marcarPagada?: boolean;
  datosContacto: {
    nombre: string;
    rut: string;
    telefono: string;
    correoEnap?: string;
    correoPersonal?: string;

    nombreResponsable?: string;
    rutResponsable?: string;
    emailResponsable?: string;
    telefonoResponsable?: string;
  };
}

// Respuesta que devuelve el backend
export interface ReservaManualResult {
  id: string;
  userId: string;
  espacioId: string;
  fechaInicio: string;
  fechaFin: string;
  totalClp: number;
  estado: string;

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
