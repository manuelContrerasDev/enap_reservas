// src/components/ui/loaders/LoaderInline.tsx
import React from "react";
import Spinner from "../feedback/Spinner";

export default function LoaderInline({
  text = "Cargando…",
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      <Spinner size={20} />
      <span>{text}</span>
    </div>
  );
}
