// src/components/layout/Sidebar/SidebarSection.tsx
import React from "react";
import SidebarItem from "./SidebarItem";

interface Item {
  label: string;
  path: string;
  icon: React.ElementType;
}

export default function SidebarSection({ items }: { items: Item[] }) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <SidebarItem key={item.path} {...item} />
      ))}
    </div>
  );
}
