import React from "react";
import LoginBase from "../../components/auth/LoginBase";

/**
 * Login del Panel de Administración
 * — Colores institucionales (verde petróleo y verde oscuro)
 */
const LoginAdmin: React.FC = () => {
  return (
    <LoginBase
      role="admin"
      title="Panel de Administración"
      description="Acceso exclusivo para administradores"
      gradientFrom="#00796B"
      gradientTo="#004D40"
      accentColor="#004D40"
      redirectPath="/admin"
    />
  );
};

export default LoginAdmin;
