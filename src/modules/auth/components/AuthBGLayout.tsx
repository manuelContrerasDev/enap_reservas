// src/modules/auth/components/AuthBGLayout.tsx
import React from "react";
import { motion } from "framer-motion";

interface AuthBGLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
  overlayOpacity?: number; // 0..1
  labelId?: string; // referencia aria-labelledby
}

export default function AuthBGLayout({
  children,
  backgroundImage,
  overlayOpacity = 0.55,
  labelId = "auth-title",
}: AuthBGLayoutProps) {
  return (
    <main
      aria-labelledby={labelId}
      className="
        min-h-screen w-full flex items-center justify-center
        bg-cover bg-center bg-no-repeat relative
        px-6 py-10
      "
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#002E3E] pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          relative z-10 w-full max-w-lg
          p-10 rounded-3xl shadow-2xl
          bg-white/90 backdrop-blur-md
          border border-white/20
        "
      >
        {children}
      </motion.article>
    </main>
  );
}
