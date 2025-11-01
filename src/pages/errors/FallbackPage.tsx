import React from "react";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, RefreshCw } from "lucide-react";

const FallbackPage: React.FC<{ error?: Error }> = ({ error }) => {
  const handleReload = () => window.location.reload();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center transition-colors bg-[#f8fafc] dark:bg-[#1f2937]">
      <Helmet>
        <title>Error del sistema | ENAP Reservas</title>
      </Helmet>

      <div className="flex flex-col items-center justify-center space-y-6 max-w-md">
        {/* Ícono */}
        <div className="p-6 rounded-full bg-[#f2b600]/20">
          <AlertTriangle className="w-16 h-16 text-[#f2b600]" />
        </div>

        {/* Texto principal */}
        <div>
          <h1 className="text-2xl font-bold text-[#004b80] dark:text-[#f2b600] mb-2">
            Ocurrió un error inesperado
          </h1>
          <p className="text-gray-700 dark:text-gray-300">
            {error?.message
              ? `Detalles técnicos: ${error.message}`
              : "Parece que algo falló al cargar el sistema. Puedes intentar recargar la página para continuar."}
          </p>
        </div>

        {/* Botón de recarga */}
        <button
          onClick={handleReload}
          className="flex items-center gap-2 bg-[#004b80] hover:bg-[#00375f] text-white font-medium px-6 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          Recargar página
        </button>
      </div>
    </div>
  );
};

export default FallbackPage;
