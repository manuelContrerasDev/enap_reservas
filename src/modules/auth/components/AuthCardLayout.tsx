// src/modules/auth/components/AuthCardLayout.tsx
import React from "react";
import { motion } from "framer-motion";
import logoEnap from "@/assets/logo-enap.png";

interface AuthCardLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function AuthCardLayout({
  title,
  description,
  children,
}: AuthCardLayoutProps) {
  return (
    <section
      aria-label="Autenticación"
      className="min-h-screen flex items-center justify-center px-4 py-10 bg-[#002E3E]"
    >
      <motion.article
        aria-labelledby="auth-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="
          w-full max-w-md
          bg-white rounded-3xl
          shadow-xl border border-gray-200
          p-10
        "
      >
        {/* Header */}
        <header className="flex flex-col items-center mb-8 text-center">
          <img
            src={logoEnap}
            alt="Logo ENAP"
            className="w-20 h-auto mb-4 rounded-md p-2 shadow bg-white"
          />

          <h1
            id="auth-title"
            className="text-2xl font-extrabold text-[#003D52] tracking-tight"
          >
            {title}
          </h1>

          {description && (
            <p className="text-gray-600 text-sm mt-1 max-w-sm">
              {description}
            </p>
          )}
        </header>

        {/* Content */}
        <div className="space-y-6">{children}</div>
      </motion.article>
    </section>
  );
}
