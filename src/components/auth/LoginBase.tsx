// src/components/auth/LoginBase.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, UserCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoEnap from "../../assets/logo-enap.png";

interface LoginBaseProps {
  role: "socio" | "admin";
  title: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: string;
  redirectPath: string;
}

/**
 * Componente base reutilizable para Login (Socio/Admin)
 * Incluye icono dinámico, colores personalizables y animaciones suaves.
 */
const LoginBase: React.FC<LoginBaseProps> = ({
  role,
  title,
  description,
  gradientFrom,
  gradientTo,
  accentColor,
  redirectPath,
}) => {
  const [nombre, setNombre] = useState<string>(role);
  const [password, setPassword] = useState<string>(role);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(nombre, password);
    if (ok) navigate(redirectPath);
    else setError("❌ Credenciales incorrectas. Intenta nuevamente.");
  };

  // 🧩 Icono según el rol
  const RoleIcon = role === "admin" ? Shield : UserCircle;
  const iconBg =
    role === "admin" ? "bg-[#E8F5E9]" : "bg-[#E0F7FA]"; // tono verde/agua claro
  const iconColor = role === "admin" ? "#00796B" : "#004D40";

  return (
    <section
      className={`min-h-screen flex flex-col bg-gradient-to-br from-[${gradientFrom}] to-[${gradientTo}] text-white`}
    >
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8"
        >
          {/* 🏢 Logo y encabezado */}
          <div className="flex flex-col items-center mb-8">
            <motion.img
              src={logoEnap}
              alt="Logo ENAP"
              className="w-20 h-auto mb-3 bg-white rounded-md p-1 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            />

            {/* 🎯 Ícono de rol */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`w-16 h-16 ${iconBg} rounded-full flex items-center justify-center mb-4 shadow-md`}
            >
              <RoleIcon size={36} color={iconColor} />
            </motion.div>

            <h1
              className="text-2xl font-bold mb-1"
              style={{ color: accentColor }}
            >
              {title}
            </h1>
            <p className="text-gray-500 text-sm text-center">{description}</p>
          </div>

          {/* 🧾 Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nombre"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Usuario
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={role}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#4DB6AC] focus:border-[#4DB6AC] transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={role}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-[#4DB6AC] focus:border-[#4DB6AC] transition-all"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-sm font-medium mt-1"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full flex items-center justify-center space-x-2 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
              style={{ backgroundColor: accentColor }}
            >
              <LogIn size={20} />
              <span>Ingresar</span>
            </motion.button>
          </form>

          {/* 💡 Credenciales demo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-[#E0F2F1] border border-[#80CBC4] rounded-lg p-4 text-center shadow-sm"
          >
            <p className="text-[#004D40] text-sm">
              Usuario: <strong>{role}</strong> <br />
              Contraseña: <strong>{role}</strong>
            </p>
          </motion.div>

          {/* 🔙 Volver */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/login")}
              className="text-[#00796B] hover:text-[#004D40] font-medium transition-colors"
            >
              ← Volver al menú de acceso
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginBase;
