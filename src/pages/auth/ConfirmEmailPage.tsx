import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LoginBase from "@/auth/components/LoginBase";
import { useNotificacion } from "@/context/NotificacionContext";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

type Status = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const token = params.get("token");

    const confirm = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Token no encontrado.");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/confirm?token=${token}`);
        const json = await res.json();

        if (!res.ok || !json.ok) {
          setStatus("error");
          setMessage(json.message || "No se pudo confirmar la cuenta.");
          agregarNotificacion(json.message, "error");
          return;
        }

        setStatus("success");
        setMessage(json.message);
        agregarNotificacion("Correo confirmado 🎉", "success");
      } catch {
        setStatus("error");
        setMessage("Error de conexión.");
      }
    };

    confirm();
  }, []);

  const goLogin = () => navigate("/auth/login", { replace: true });

  return (
    <LoginBase
      title="Confirmación de cuenta"
      description="Validando tu información…"
      gradientFrom="#4DB6AC"
      gradientTo="#00796B"
      accentColor="#00796B"
      loading={status === "loading"}
    >
      <div className="flex flex-col items-center text-center space-y-6">
        {status === "loading" && (
          <p className="text-gray-600 text-sm">Procesando…</p>
        )}

        {status === "success" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-green-700 font-semibold">{message}</p>
            <button
              onClick={goLogin}
              className="px-6 py-3 bg-[#00796B] text-white font-semibold rounded-lg shadow-md hover:bg-[#00695C] transition-all"
            >
              Iniciar sesión
            </button>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-red-600 font-medium">{message}</p>
            <button
              onClick={goLogin}
              className="px-6 py-3 bg-[#00796B] text-white font-semibold rounded-lg shadow-md hover:bg-[#00695C] transition-all"
            >
              Volver al login
            </button>
          </motion.div>
        )}
      </div>
    </LoginBase>
  );
}
