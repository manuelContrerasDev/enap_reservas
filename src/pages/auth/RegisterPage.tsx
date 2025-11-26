import { RegisterForm } from "@/auth/components/RegisterForm";
import LoginBase from "@/auth/components/LoginBase";
import { useNavigate } from "react-router-dom";

export default function RegisterPro() {
  const navigate = useNavigate();

  return (
    <LoginBase
      title="Crear cuenta"
      description="Regístrate para acceder al sistema de reservas."
      gradientFrom="#4DB6AC"
      gradientTo="#00796B"
      accentColor="#00796B"
    >
      <RegisterForm />

      <div className="text-center text-dark mt-6">
        <button
          onClick={() => navigate("/auth/login")}
          className="text-[#00796B] hover:text-[#004D40]"
        >
          ¿Ya tienes cuenta? Inicia sesión →
        </button>
      </div>
    </LoginBase>
  );
}
