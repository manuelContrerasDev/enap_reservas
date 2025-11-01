import React from "react";
import { motion } from "framer-motion";
import { UserCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FooterPublic from "../components/layout/FooterPublic";
import logoEnap from "../assets/logo-enap.png";

/**
 * Página pública de inicio de sesión
 * Selección de rol (Socio / Administrador)
 * — ENAP Refinería Aconcagua
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  /** 🎨 Configuración de roles */
  const roles = [
    { role: "socio", color: "#00796B", icon: UserCircle, label: "Socio" },
    { role: "admin", color: "#4DB6AC", icon: Shield, label: "Administrador" },
  ] as const;

  /** 🔀 Redirección según rol */
  const handleRedirect = (role: "socio" | "admin") => {
    navigate(`/login-${role}`);
  };

  return (
    <section className="min-h-screen flex flex-col bg-gradient-to-br from-[#00796B] via-[#00695C] to-[#004D40] text-white">
      {/* Contenido central */}
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl w-full bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10"
        >
          {/* Logo */}
          <motion.img
            src={logoEnap}
            alt="Logo ENAP Refinería Aconcagua"
            className="w-28 h-auto mx-auto mb-8 bg-white rounded-lg p-2 shadow-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Encabezado */}
          <header className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-white">
              Sistema de Arriendos, Reservas y Pagos
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              ENAP Refinería Aconcagua — Limache
            </p>
          </header>

          {/* Opciones */}
          <div
            className="grid md:grid-cols-2 gap-6"
            aria-label="Opciones de acceso"
          >
            {roles.map(({ role, color, icon: Icon, label }) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRedirect(role)}
                className="bg-white text-[#0D1B2A] rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all focus:outline-none focus:ring-4 focus:ring-[#4DB6AC]/40"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: color }}
                  >
                    <Icon
                      size={34}
                      className={role === "admin" ? "text-[#0D1B2A]" : "text-white"}
                    />
                  </div>
                  <h2 className="text-2xl font-semibold">
                    Ingresar como {label}
                  </h2>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {role === "admin"
                      ? "Gestiona reservas, pagos y control del sistema."
                      : "Reserva cabañas y espacios recreativos fácilmente."}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <FooterPublic />
    </section>
  );
};

export default LoginPage;
