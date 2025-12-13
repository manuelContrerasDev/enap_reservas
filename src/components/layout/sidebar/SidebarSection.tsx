// src/components/layout/Sidebar/SidebarSection.tsx
import React from "react";
import SidebarItem from "./SidebarItem";

export default function SidebarSection({
  items,
}: {
  items: { label: string; path: string; icon: any }[];
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <SidebarItem key={item.path} {...item} />
      ))}
    </div>
  );
}
