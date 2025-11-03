import React from "react";
import { Helmet } from "react-helmet-async";
import LoginBase from "../../components/auth/LoginBase";

/**
 * Login del Panel de Administración — ENAP
 * Paleta institucional (verde petróleo y verde oscuro)
 */
const LoginAdmin: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Acceso Administrador | ENAP Limache</title>
        <meta
          name="description"
          content="Ingreso al panel de administración del Sistema de Reservas y Pagos de ENAP Limache."
        />
      </Helmet>

      <LoginBase
        role={"admin" as const}
        title="Panel de Administración"
        description="Acceso exclusivo para administradores"
        gradientFrom="#00796B"
        gradientTo="#004D40"
        accentColor="#004D40"
        redirectPath="/admin"
      />
    </>
  );
};

export default React.memo(LoginAdmin);
