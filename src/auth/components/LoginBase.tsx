import React from "react";
import { motion } from "framer-motion";
import logoEnap from "../../assets/logo-enap.png";

interface LoginBaseProps {
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  loading?: boolean;
  errorMessage?: string | null;
  children?: React.ReactNode;
}

const LoginBase: React.FC<LoginBaseProps> = ({
  title,
  description,
  gradientFrom,
  gradientTo,
  accentColor,
  loading = false,
  errorMessage,
  children,
}) => {
  return (
    <section
      className="min-h-screen flex flex-col text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <motion.img
              src={logoEnap}
              alt="Logo ENAP"
              className="w-20 h-auto mb-4 bg-white rounded-md p-1 shadow-sm"
            />

            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: accentColor }}
            >
              {title}
            </h1>
            <p className="text-gray-500 text-sm text-center">{description}</p>
          </div>

          {/* FORMULARIO INYECTADO */}
          <div className="space-y-4">{children}</div>

          {/* Error global */}
          {errorMessage && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-600 text-sm font-medium mt-4 text-center"
            >
              {errorMessage}
            </motion.p>
          )}

          {/* Loading */}
          {loading && (
            <p className="text-xs text-gray-400 text-center mt-2">
              Procesando…
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default LoginBase;
