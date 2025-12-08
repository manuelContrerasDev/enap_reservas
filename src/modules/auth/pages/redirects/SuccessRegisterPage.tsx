// src/pages/auth/redirects/SuccessRegisterPage.tsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoginBase from "@/modules/auth/components/AuthLoginBase";
import { PATHS } from "@/routes/paths";

export default function SuccessRegisterPage() {
  const navigate = useNavigate();

  return (
    <LoginBase
      title="Cuenta creada"
      description="Revisa tu correo para confirmar tu cuenta"
      gradientFrom="#002E3E"
      gradientTo="#004659"
      accentColor="#C7A96A"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center space-y-6 mt-4"
      >
        <p className="text-green-700 font-semibold text-lg">
          ✔ ¡Tu cuenta fue creada con éxito!
        </p>

        <p className="text-gray-600 text-sm leading-relaxed">
          Te enviamos un enlace a tu correo para completar la validación
          de tu cuenta.  
          <br/>  
          Si no lo ves, revisa tu carpeta de correo no deseado.
        </p>

        <button
          onClick={() => navigate(PATHS.AUTH_LOGIN)}
          className="px-6 py-3 w-full bg-[#C7A96A] text-white font-semibold rounded-lg shadow-md hover:bg-[#b09058] transition-all"
        >
          Volver al login
        </button>
      </motion.div>
    </LoginBase>
  );
}
