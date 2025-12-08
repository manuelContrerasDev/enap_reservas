// src/auth/components/AuthBGLayout.tsx
import React from "react";
import { motion } from "framer-motion";

interface AuthBGLayoutProps {
  children: React.ReactNode;
  backgroundImage: string;
  overlayOpacity?: number;
}

export default function AuthBGLayout({
  children,
  backgroundImage,
  overlayOpacity = 0.55, // un poco más profesional
}: AuthBGLayoutProps) {
  return (
    <div
      className="
        min-h-screen w-full flex items-center justify-center 
        bg-cover bg-center bg-no-repeat relative 
        px-6 py-10
      "
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* === OVERLAY === */}
      <div
        className="absolute inset-0 bg-[#002E3E]"
        style={{
          opacity: overlayOpacity,
        }}
      />

      {/* === AUTH PANEL === */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="
          relative z-10 w-full max-w-lg
          p-10 rounded-3xl shadow-2xl
          bg-white/85 backdrop-blur-md
          border border-white/20
        "
      >
        {children}
      </motion.div>
    </div>
  );
}
