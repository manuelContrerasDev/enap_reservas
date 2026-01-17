// src/components/layout/LayoutBase.tsx
import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./sideBar";
import HeaderTop from "./HeaderTop";
import PageWrapper from "./PageWrapper";

import { EspaciosProvider } from "@/modules/espacios/context/EspaciosContext";

export default function LayoutBase() {
  return (
    <EspaciosProvider>
      <div className="min-h-screen flex bg-gray-100 text-gray-900">

        {/* ASIDE — SIDEBAR */}
        <aside
          className="
            w-64 bg-[#002E3E] text-white
            border-r border-[#003B4D]/30
            shadow-xl relative z-20
          "
        >
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* HEADER GLOBAL */}
          <header className="sticky top-0 z-10 bg-white shadow-sm">
            <HeaderTop />
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 overflow-y-auto">
            <PageWrapper>
              <Outlet />
            </PageWrapper>
          </main>
        </div>
      </div>
    </EspaciosProvider>
  );
}
