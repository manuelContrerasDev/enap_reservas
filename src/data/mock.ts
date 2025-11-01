// Mock Data - ENAP Limache MVP (con persistencia localStorage + CRUD + compat /admin)

export interface Usuario {
  id: number;
  nombre: string;
  rol: "socio" | "admin";
  password?: string;
}

export interface Espacio {
  id: number;
  nombre: string;
  tipo: string;
  capacidad: number;
  tarifa: number;
  descripcion: string;
  imagen: string;
}

export interface Reserva {
  id: number;
  usuario: string;
  espacio: string;          // nombre del espacio (tu modelo actual)
  fecha_inicio: string;     // YYYY-MM-DD
  fecha_fin: string;        // YYYY-MM-DD
  personas: number;
  total: number;
  estado: "pendiente" | "confirmada" | "cancelada";
  created_at?: string;
  updated_at?: string;
}

/** 🔁 Compatibilidad con /admin: agrega espacio_nombre para no tocar la UI */
export type ReservaUI = Reserva & { espacio_nombre: string };

// ================== Seeds originales ==================
export const usuarios: Usuario[] = [
  { id: 1, nombre: "socio", rol: "socio", password: "socio" },
  { id: 2, nombre: "Admin", rol: "admin", password: "admin" },
];

export const espaciosSeed: Espacio[] = [
  {
    id: 1,
    nombre: "Cabaña Los Robles",
    tipo: "Cabaña",
    capacidad: 4,
    tarifa: 45000,
    descripcion: "Cabaña equipada con vista al bosque.",
    imagen: "https://placehold.co/400x250?text=Cabaña+Los+Robles",
  },
  {
    id: 2,
    nombre: "Zona Picnic A",
    tipo: "Zona",
    capacidad: 10,
    tarifa: 25000,
    descripcion: "Espacio amplio con quincho y parrilla.",
    imagen: "https://placehold.co/400x250?text=Zona+Picnic+A",
  },
  {
    id: 3,
    nombre: "Cabaña La Loma",
    tipo: "Cabaña",
    capacidad: 6,
    tarifa: 55000,
    descripcion: "Ideal para familias, incluye estacionamiento.",
    imagen: "https://placehold.co/400x250?text=Cabaña+La+Loma",
  },
];

export const reservasSeed: Reserva[] = [
  {
    id: 1,
    usuario: "Carlos Soto",
    espacio: "Cabaña Los Robles",
    fecha_inicio: "2025-10-28",
    fecha_fin: "2025-10-30",
    personas: 4,
    total: 90000,
    estado: "pendiente",
    created_at: new Date().toISOString(),
  },
];

// ================== Store (localStorage) ==================
const K_E = "enap_espacios";
const K_R = "enap_reservas";

const isBrowser = typeof window !== "undefined" && !!window.localStorage;
const nowISO = () => new Date().toISOString();
const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

let memEspacios = [...espaciosSeed];
let memReservas = [...reservasSeed];

function read<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// init seeds una vez
(function init() {
  const es = read<Espacio[]>(K_E, []);
  const rs = read<Reserva[]>(K_R, []);
  if (es.length === 0) write(K_E, espaciosSeed);
  if (rs.length === 0) write(K_R, reservasSeed);
  // espejo en memoria para entornos sin localStorage (SSR/preview)
  memEspacios = es.length ? es : espaciosSeed;
  memReservas = rs.length ? rs : reservasSeed;
})();

// helpers de id incremental (simple & suficiente para MVP)
function nextId(list: { id: number }[]): number {
  return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
}

// ================== API mock: Espacios ==================
export async function listEspacios(): Promise<Espacio[]> {
  await delay();
  const data = isBrowser ? read<Espacio[]>(K_E, memEspacios) : memEspacios;
  return [...data].sort((a, b) => b.id - a.id);
}

export async function insertEspacio(input: Omit<Espacio, "id">): Promise<Espacio> {
  await delay();
  const all = isBrowser ? read<Espacio[]>(K_E, memEspacios) : memEspacios;
  const row: Espacio = { ...input, id: nextId(all) };
  const next = [row, ...all];
  if (isBrowser) write(K_E, next);
  memEspacios = next;
  return row;
}

export async function updateEspacio(id: number, patch: Partial<Espacio>): Promise<void> {
  await delay();
  const all = isBrowser ? read<Espacio[]>(K_E, memEspacios) : memEspacios;
  const next = all.map((e) => (e.id === id ? { ...e, ...patch } : e));
  if (isBrowser) write(K_E, next);
  memEspacios = next;
}

export async function deleteEspacio(id: number): Promise<void> {
  await delay();
  const all = isBrowser ? read<Espacio[]>(K_E, memEspacios) : memEspacios;
  const next = all.filter((e) => e.id !== id);
  if (isBrowser) write(K_E, next);
  memEspacios = next;
}

export async function findEspacioById(id: number): Promise<Espacio | undefined> {
  const all = isBrowser ? read<Espacio[]>(K_E, memEspacios) : memEspacios;
  return all.find((e) => e.id === id);
}

export async function findEspacioByName(nombre: string): Promise<Espacio | undefined> {
  const all = isBrowser ? read<Espacio[]>(K_E, memEspacios) : memEspacios;
  return all.find((e) => e.nombre === nombre);
}

// ================== API mock: Reservas ==================
export async function listReservas(): Promise<ReservaUI[]> {
  await delay();
  const data = isBrowser ? read<Reserva[]>(K_R, memReservas) : memReservas;
  // compat /admin → espacio_nombre
  return data
    .slice()
    .sort((a, b) => b.id - a.id)
    .map((r) => ({ ...r, espacio_nombre: r.espacio }));
}

export async function insertReserva(input: {
  usuario: string;
  espacioId?: number;         // puedes pasar id…
  espacioNombre?: string;     // …o nombre (se resuelve)
  fecha_inicio: string;       // YYYY-MM-DD
  fecha_fin: string;          // YYYY-MM-DD
  personas: number;
  total?: number;             // si no viene, se calcula
  estado?: Reserva["estado"];
}): Promise<ReservaUI> {
  await delay();
  const reservas = isBrowser ? read<Reserva[]>(K_R, memReservas) : memReservas;

  // resolver espacio
  let espacioNombre = input.espacioNombre || "";
  if (!espacioNombre && input.espacioId) {
    const e = await findEspacioById(input.espacioId);
    if (e) espacioNombre = e.nombre;
  }
  // calcular total si falta
  let total = input.total ?? 0;
  if (!total) {
    const e = await findEspacioByName(espacioNombre);
    const tarifa = e?.tarifa ?? 0;
    const dias = Math.max(
      1,
      Math.ceil(
        (new Date(input.fecha_fin).getTime() - new Date(input.fecha_inicio).getTime()) /
          (24 * 60 * 60 * 1000)
      )
    );
    total = dias * tarifa * Math.max(1, Number(input.personas || 1));
  }

  const row: Reserva = {
    id: nextId(reservas),
    usuario: input.usuario,
    espacio: espacioNombre,
    fecha_inicio: input.fecha_inicio,
    fecha_fin: input.fecha_fin,
    personas: Math.max(1, input.personas),
    total,
    estado: input.estado ?? "confirmada",
    created_at: nowISO(),
  };

  const next = [row, ...reservas];
  if (isBrowser) write(K_R, next);
  memReservas = next;
  return { ...row, espacio_nombre: row.espacio };
}

export async function updateReserva(id: number, patch: Partial<Reserva>): Promise<void> {
  await delay();
  const all = isBrowser ? read<Reserva[]>(K_R, memReservas) : memReservas;
  const next = all.map((r) =>
    r.id === id ? { ...r, ...patch, updated_at: nowISO() } : r
  );
  if (isBrowser) write(K_R, next);
  memReservas = next;
}

export async function updateReservaEstado(id: number, estado: Reserva["estado"]): Promise<void> {
  return updateReserva(id, { estado });
}

export async function deleteReserva(id: number): Promise<void> {
  await delay();
  const all = isBrowser ? read<Reserva[]>(K_R, memReservas) : memReservas;
  const next = all.filter((r) => r.id !== id);
  if (isBrowser) write(K_R, next);
  memReservas = next;
}
