// src/auth/components/AuthHeader.tsx
import React from "react";
import { motion } from "framer-motion";

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}

export default function AuthHeader({
  title,
  subtitle,
  align = "center",
}: AuthHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={`flex flex-col gap-1 ${
        align === "center"
          ? "items-center text-center"
          : "items-start text-left"
      }`}
    >
      <h1
        className="
          text-3xl md:text-4xl font-extrabold
          text-[#003D52]           /* ENAP primary */
          tracking-tight leading-tight
        "
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="
            text-sm md:text-base
            text-gray-600
            max-w-sm md:max-w-md
            leading-relaxed
          "
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
