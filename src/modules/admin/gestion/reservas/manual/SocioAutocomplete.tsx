import { useState } from "react";
import { useBuscarSocios } from "@/modules/admin/components/hooks/useBuscarSocios";

interface Props {
  onSelect: (socio: {
    id: string;
    name: string | null;
    email: string | null;
  }) => void;
}

export const SocioAutocomplete: React.FC<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const { buscar, resultados, loading } = useBuscarSocios();

  return (
    <div className="space-y-2">
      <input
        placeholder="Buscar socio por nombre o email"
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          if (v.length >= 2) buscar(v);
        }}
      />

      {loading && <p className="text-sm">Buscando…</p>}

      {resultados.map((u) => (
        <button
          key={u.id}
          type="button"
          onClick={() => {
            onSelect(u);
            setQuery(u.name ?? u.email ?? "");
          }}
          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
        >
          {u.name} — {u.email}
        </button>
      ))}
    </div>
  );
};
