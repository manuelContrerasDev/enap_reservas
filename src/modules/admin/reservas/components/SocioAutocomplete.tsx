// ============================================================
// SocioAutocomplete.tsx — ENAP Premium Minimalista 2025
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useBuscarSocios } from "@/modules/admin/components/hooks/useBuscarSocios";

interface Props {
  onSelect: (socio: {
    id: string;
    name: string | null;
    rut: string | null;
    email: string | null;
  }) => void;
}

const SocioAutocomplete: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { buscar, loading, resultados } = useBuscarSocios();

  // Buscar cuando el usuario escribe
  useEffect(() => {
    if (query.trim().length >= 2) buscar(query);
  }, [query]);

  // Cerrar dropdown si clic fuera
  useEffect(() => {
    const handler = (e: any) => {
      if (!containerRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (user: any) => {
    onSelect(user);
    setQuery(`${user.name ?? ""} (${user.rut ?? "N/A"})`);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* INPUT */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          className="input pl-10"
          placeholder="Buscar socio por nombre, RUT o correo…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg max-h-64 overflow-auto animate-fadeIn">
          {loading && (
            <div className="p-4 flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin h-4 w-4" /> Buscando…
            </div>
          )}

          {!loading && resultados.length === 0 && query.length >= 2 && (
            <div className="p-4 text-gray-500 text-sm">Sin resultados</div>
          )}

          {!loading &&
            resultados.map((u: any) => (
              <button
                key={u.id}
                onClick={() => handleSelect(u)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium">{u.name ?? "Sin nombre"}</p>
                <p className="text-xs text-gray-500">
                  {u.rut ?? "—"} — {u.email}
                </p>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default SocioAutocomplete;
