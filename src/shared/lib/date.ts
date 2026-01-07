// src/shared/lib/date.ts

/**
 * Convierte una fecha ISO a fecha local real (sin offset UTC)
 * Usado para calendarios y comparaciones día-a-día
 */
export function fechaLocal(iso: string): Date {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
  return d;
}

/**
 * Formatea fecha en formato CL (dd-mm-yyyy)
 */
export function formatDateCL(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
