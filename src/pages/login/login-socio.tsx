import React from "react";
import { Helmet } from "react-helmet-async";
import LoginBase from "../../components/auth/LoginBase";
// import { PATHS } from "../../routes/paths";

/**
 * Login para Socios — ENAP Limache
 * Gradiente amigable (turquesa → verde)
 */
const LoginSocio: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Ingreso Socios | ENAP Limache</title>
        <meta
          name="description"
          content="Accede como socio al Sistema de Reservas y Pagos de ENAP Limache para reservar cabañas y espacios recreativos."
        />
      </Helmet>

      <LoginBase
        role={"socio" as const}
        title="Ingreso Socios"
        description="Accede para reservar cabañas y espacios recreativos"
        gradientFrom="#4DB6AC"
        gradientTo="#00796B"
        accentColor="#00796B"
        redirectPath="/espacios" // o PATHS.ESPACIOS
      />
    </>
  );
};

export default React.memo(LoginSocio);
