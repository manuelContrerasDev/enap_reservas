// src/components/layout/Sidebar/SidebarHeader.tsx
import React from "react";

export default function SidebarHeader({ user }: { user: any }) {
  return (
    <header className="px-6 pt-8 pb-6 border-b border-white/10">
      <h1 className="text-xl font-semibold tracking-wide">
        <span className="text-[#7fee53]">ENAP</span> Reservas
      </h1>

      <p className="text-sm text-white/60 mt-1">
        {user?.name ?? "Usuario"}
      </p>
    </header>
  );
}
