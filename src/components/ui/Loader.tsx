// src/components/ui/Loader.tsx
import { Loader2 } from "lucide-react";

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
    <Loader2 className="animate-spin text-[#004b87]" size={48} />
    <span className="sr-only">Cargando…</span>
  </div>
);

export default Loader;
