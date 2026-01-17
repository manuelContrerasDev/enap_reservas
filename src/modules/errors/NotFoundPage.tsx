import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { MapPinOff } from "lucide-react";
import { useAuth } from "@/modules/auth/hooks";
import { PATHS } from "@/routes/paths";

const NotFoundPage: React.FC = () => {
  const { isAdmin, isSocio, isExterno } = useAuth();

  // 🔥 HOME correcto según rol
  const homePath = isAdmin
    ? PATHS.ADMIN_HOME
    : isSocio
    ? PATHS.SOCIO_HOME
    : isExterno
    ? PATHS.EXTERNO_HOME
    : PATHS.AUTH_LOGIN;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center transition-colors bg-[#f8fafc] dark:bg-[#1f2937]">
      <Helmet>
        <title>404 | ENAP Reservas</title>
      </Helmet>

      <div className="flex flex-col items-center space-y-6 max-w-md">

        {/* Ícono */}
        <div className="p-6 rounded-full bg-[#004b80]/10">
          <MapPinOff className="w-16 h-16 text-[#004b80] dark:text-[#f2b600]" />
        </div>

        {/* Texto */}
        <div>
          <h1 className="text-5xl font-bold text-[#004b80] dark:text-[#f2b600] mb-2">
            404
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            La página que buscas no existe o fue movida.
          </p>
        </div>

        {/* Botón */}
        <Link
          to={homePath}
          className="bg-[#004b80] hover:bg-[#00375f] text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
