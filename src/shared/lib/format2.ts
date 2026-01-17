export const clp = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

export const num = (n: number) => new Intl.NumberFormat("es-CL").format(n);
