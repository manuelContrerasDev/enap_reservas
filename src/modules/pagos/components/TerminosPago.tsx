// src/modules/pagos/components/TerminosPago.tsx
import React from "react";
import { ShieldCheck } from "lucide-react";

interface Props {
  aceptaReglamento: boolean;
  setAceptaReglamento: (v: boolean) => void;

  aceptaPoliticas: boolean;
  setAceptaPoliticas: (v: boolean) => void;

  onOpenReglamento: () => void;
  onOpenPoliticas: () => void;
}

export default function TerminosPago({
  aceptaReglamento,
  setAceptaReglamento,
  aceptaPoliticas,
  setAceptaPoliticas,
  onOpenReglamento,
  onOpenPoliticas,
}: Props) {
  return (
    <section className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
      <h3 className="text-xl font-bold text-[#002E3E] mb-6 flex items-center gap-2">
        <ShieldCheck size={22} className="text-[#002E3E]" />
        Aceptación de Términos
      </h3>

      {/* Reglamento Interno */}
      <label className="flex items-center gap-3 mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={aceptaReglamento}
          onChange={(e) => setAceptaReglamento(e.target.checked)}
          className="h-5 w-5"
        />
        <span className="text-gray-800">
          Acepto el{" "}
          <button
            type="button"
            onClick={onOpenReglamento}
            className="text-[#002E3E] underline font-medium"
          >
            reglamento interno
          </button>
        </span>
      </label>

      {/* Políticas */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={aceptaPoliticas}
          onChange={(e) => setAceptaPoliticas(e.target.checked)}
          className="h-5 w-5"
        />
        <span className="text-gray-800">
          Acepto las{" "}
          <button
            type="button"
            onClick={onOpenPoliticas}
            className="text-[#002E3E] underline font-medium"
          >
            políticas y condiciones de uso
          </button>
        </span>
      </label>
    </section>
  );
}
