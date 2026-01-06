// SocioAutocomplete.tsx — ENAP 2025 (PREPARADO / NO INTEGRADO)

interface SocioResult {
  id: string;
  name: string | null;
  rut: string | null;
  email: string | null;
}

interface Props {
  onSelect: (socio: SocioResult) => void;
}
