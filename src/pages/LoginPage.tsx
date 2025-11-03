import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { UserCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "../components/layout/Footer";
import logoEnap from "../assets/logo-enap.png";

/** 🎯 Configuración de roles (fuera del componente para evitar recreación en cada render) */
const ROLES = [
  {
    key: "socio",
    label: "Socio",
    description: "Reserva cabañas y espacios recreativos fácilmente.",
    icon: UserCircle,
    // Colores alineados a la paleta que ya usas en la app
    bg: "bg-[#00796B]",
    iconColorClass: "text-white",
  },
  {
    key: "admin",
    label: "Administrador",
    description: "Gestiona reservas, pagos y control del sistema.",
    icon: Shield,
    bg: "bg-[#4DB6AC]",
    iconColorClass: "text-[#0D1B2A]",
  },
] as const;

type RoleKey = typeof ROLES[number]["key"];

/**
 * Página pública de inicio de sesión — ENAP Refinería Aconcagua
 * Selección de rol (Socio / Administrador)
 */
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  /** 🔀 Redirección según rol (type-safe) */
  const handleRedirect = (role: RoleKey) => {
    navigate(`/login-${role}`);
  };

  /** ✨ Variants de animación con soporte a prefers-reduced-motion */
  const containerVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: reduceMotion ? 0 : 0.5, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: reduceMotion ? 0 : 0.35 } },
  };

  return (
    <>
      {/* 🧠 SEO / Título de la página */}
      <Helmet>
        <title>Acceso | ENAP Limache — Reservas y Pagos</title>
        <meta
          name="description"
          content="Selecciona tu rol para acceder al Sistema de Arriendos, Reservas y Pagos de ENAP Refinería Aconcagua."
        />
      </Helmet>

      <main
        className="min-h-screen flex flex-col bg-gradient-to-br from-[#00796B] via-[#00695C] to-[#004D40] text-white"
        role="main"
        aria-labelledby="login-title"
      >
        {/* Contenido central */}
        <div className="flex-grow flex items-center justify-center p-6">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl w-full"
          >
            <motion.div
              variants={cardVariants}
              className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-10"
              role="region"
              aria-labelledby="login-title"
            >
              {/* Logo (con atributos que evitan layout shifts) */}
              <div className="flex justify-center">
                <img
                  src={logoEnap}
                  alt="Logo ENAP Refinería Aconcagua"
                  width={112}
                  height={112}
                  loading="eager"
                  className="w-28 h-auto mb-8 bg-white rounded-lg p-2 shadow-md"
                />
              </div>

              {/* Encabezado semántico */}
              <header className="text-center mb-12">
                <h1 id="login-title" className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-white">
                  Sistema de Arriendos, Reservas y Pagos
                </h1>
                <p className="text-lg md:text-xl text-gray-200">
                  ENAP Refinería Aconcagua — Limache
                </p>
              </header>

              {/* Opciones de acceso */}
              <div
                className="grid md:grid-cols-2 gap-6"
                role="group"
                aria-label="Opciones de acceso"
              >
                {ROLES.map(({ key, label, description, icon: Icon, bg, iconColorClass }) => (
                  <motion.button
                    key={key}
                    whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    onClick={() => handleRedirect(key)}
                    className="bg-white text-[#0D1B2A] rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-[#4DB6AC]/40"
                    aria-describedby={`desc-${key}`}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md ${bg}`}>
                        <Icon size={34} className={iconColorClass} aria-hidden="true" />
                      </div>
                      <h2 className="text-2xl font-semibold">Ingresar como {label}</h2>
                      <p id={`desc-${key}`} className="text-gray-600 text-center text-sm leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.section>
        </div>

        {/* Footer*/}
        <Footer />
      </main>
    </>
  );
};

export default LoginPage;
