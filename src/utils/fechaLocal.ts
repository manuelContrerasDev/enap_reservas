// utils/fechaLocal.ts
export function fechaLocal(dateISO: string) {
  const [y, m, d] = dateISO.split("-").map(Number);
  return new Date(y, m - 1, d); // <- Date local, NO UTC
}
