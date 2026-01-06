// src/components/layout/Sidebar/SidebarItem.tsx
import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  label: string;
  path: string;
  icon: React.ElementType;
}

export default function SidebarItem({ label, path, icon: Icon }: Props) {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        `
        group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium
        transition-all duration-200
        ${
          isActive
            ? "bg-[#01485E] text-white shadow-inner"
            : "hover:bg-[#013748] text-white/80 hover:text-white"
        }
        `
      }
    >
      {Icon && <Icon className="h-5 w-5 opacity-90" />}
      {label}
    </NavLink>
  );
}
