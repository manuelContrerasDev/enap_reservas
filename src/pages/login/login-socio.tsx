import React from "react";
import LoginBase from "../../components/auth/LoginBase";

/**
 * Login para Socios
 * — Gradiente más claro y amigable (turquesa → verde)
 */
const LoginSocio: React.FC = () => {
  return (
    <LoginBase
      role="socio"
      title="Ingreso Socios"
      description="Accede para reservar cabañas y espacios recreativos"
      gradientFrom="#4DB6AC"
      gradientTo="#00796B"
      accentColor="#00796B"
      redirectPath="/espacios"
    />
  );
};

export default LoginSocio;
