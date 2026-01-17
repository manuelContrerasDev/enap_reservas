// src/components/layout/HeaderTop/index.tsx
import React from "react";
import { useAuth } from "@/modules/auth/hooks";

//import HeaderTitle from "./HeaderTitle";
import HeaderDarkMode from "./HeaderDarkMode";
import HeaderNotifications from "./HeaderNotifications";
import HeaderLogout from "./HeaderLogout";

export default function HeaderTop() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header
      className="
        sticky top-0 z-40 w-full 
        bg-[#002E3E]/95 text-white
        backdrop-blur-sm shadow-md 
        border-b border-[#003B4D]/40
        flex items-center justify-between
        px-6 py-3
      "
    >
      <div className="flex items-center gap-3">
        <HeaderDarkMode />
        <HeaderNotifications />
        <HeaderLogout />
      </div>
    </header>
  );
}
