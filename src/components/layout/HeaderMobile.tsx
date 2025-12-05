import React from "react";
import { Menu } from "lucide-react";

interface Props {
  onOpenMenu: () => void;
}

export default function HeaderMobile({ onOpenMenu }: Props) {
  return (
    <header className="lg:hidden bg-[#002E3E] text-white py-4 px-4 shadow-md flex items-center justify-between">
      <h1 className="text-lg font-semibold">
        <span className="text-[#FFD84D]">ENAP</span> Reservas
      </h1>

      <button
        onClick={onOpenMenu}
        className="p-2 rounded-md bg-[#01485E] hover:bg-[#013748] transition"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>
    </header>
  );
}
