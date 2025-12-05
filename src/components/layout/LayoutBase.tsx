// src/components/layout/LayoutBase.tsx
import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import HeaderTop from "@/components/layout/HeaderTop";
import { EspaciosProvider } from "@/context/EspaciosContext";

export default function LayoutBase() {
  return (
    <EspaciosProvider>
      <div className="flex min-h-screen bg-gray-100 text-gray-900">

        {/* SIDEBAR */}
        <aside className="w-64 bg-[#002E3E] text-white">
          <Sidebar />
        </aside>

        {/* CONTENIDO */}
        <div className="flex-1 flex flex-col">

          {/* 🆕 HEADER SUPERIOR */}
          <HeaderTop />

          {/* PAGE */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </EspaciosProvider>
  );
}
