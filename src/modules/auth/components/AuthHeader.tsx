// src/modules/auth/components/AuthHeader.tsx
import React from "react";
import { motion } from "framer-motion";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
}

export default function AuthHeader({
  title,
  subtitle,
  align = "center",
  as = "h1",
}: AuthHeaderProps) {
  const TitleTag = as;

  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`flex flex-col gap-1 ${
        align === "center"
          ? "items-center text-center"
          : "items-start text-left"
      }`}
    >
      <TitleTag className="text-3xl md:text-4xl font-extrabold text-[#003D52] tracking-tight leading-tight">
        {title}
      </TitleTag>

      {subtitle && (
        <p
          className="text-sm md:text-base text-gray-600 max-w-md leading-relaxed"
          id="auth-subtitle"
        >
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
