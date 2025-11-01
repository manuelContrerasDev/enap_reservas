import React from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Clock,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoEnap from "../../assets/logo-enap.png";

/**
 * Footer institucional ENAP — Inspirado en Rápida&Sabrosa pero adaptado a entorno corporativo.
 * Colores: Azul petróleo (#002E3E) + Dorado (#DEC01F)
 * Diseño: Limpio, formal, informativo y responsivo.
 */
const Footer: React.FC = () => {
  const enlaces = [
    { id: "inicio", title: "Inicio", to: "/" },
    { id: "espacios", title: "Espacios", to: "/espacios" },
    { id: "reservas", title: "Reservas", to: "/reserva" },
    { id: "socios", title: "Socios", to: "/socios" },
    { id: "contacto", title: "Contacto", to: "#" },
  ];

  const redes = [
    { id: "linkedin", icon: Linkedin, href: "https://www.linkedin.com/company/enap/" },
    { id: "facebook", icon: Facebook, href: "https://www.facebook.com/ENAPChile" },
    { id: "instagram", icon: Instagram, href: "https://www.instagram.com/enap_chile/" },
    { id: "web", icon: Globe, href: "https://www.enap.cl/" },
  ];

  const horarios = [
    { id: 1, label: "Lunes a Viernes", horas: "08:30 - 17:30" },
    { id: 2, label: "Sábado y Domingo", horas: "Cerrado" },
  ];

  return (
    <footer
      role="contentinfo"
      aria-label="Pie de página institucional"
      className="bg-[#002E3E] text-white border-t border-[#DEC01F]/40"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4"
      >
        {/* 🏢 Sobre ENAP */}
        <section aria-labelledby="footer-enap">
          <h3
            id="footer-enap"
            className="text-xl font-bold text-[#DEC01F] mb-4 flex items-center gap-2"
          >
            <img
              src={logoEnap}
              alt="Logo ENAP Refinería Aconcagua"
              className="w-10 h-auto bg-white rounded-md p-1.5 shadow-sm"
              loading="lazy"
            />
            ENAP Refinería Aconcagua
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Sistema de Arriendos y Reservas — Limache.
            Plataforma interna para la gestión de espacios, reservas y socios.
          </p>
          <div className="flex space-x-4 mt-2">
            {redes.map(({ id, icon: Icon, href }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#DEC01F] transition-colors"
                aria-label={`Ir a ${id}`}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </section>

        {/* ☎️ Contacto */}
        <address className="not-italic text-sm text-gray-300 space-y-3">
          <h3 className="text-xl font-bold text-[#DEC01F] mb-3">Contacto</h3>
          <p className="flex items-start gap-2">
            <Phone size={18} className="text-[#DEC01F] mt-0.5" />
            <span>+56 9 8765 4321</span>
          </p>
          <p className="flex items-start gap-2">
            <Mail size={18} className="text-[#DEC01F] mt-0.5" />
            <span>contacto@enap.cl</span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin size={18} className="text-[#DEC01F] mt-0.5" />
            <span>Av. Urmeneta s/n, Limache, Región de Valparaíso</span>
          </p>
        </address>

        {/* ⏰ Horario */}
        <section aria-labelledby="footer-horario" className="text-sm text-gray-300">
          <h3
            id="footer-horario"
            className="text-xl font-bold text-[#DEC01F] mb-3 flex items-center gap-2"
          >
            <Clock size={18} className="text-[#DEC01F]" />
            Horario de Atención
          </h3>
          <ul className="space-y-2">
            {horarios.map(({ id, label, horas }) => (
              <li key={id} className="flex items-start gap-2">
                <Clock size={16} className="text-[#DEC01F] mt-1" />
                <div>
                  <p className="font-medium">{label}</p>
                  <p>{horas}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 🔗 Enlaces rápidos */}
        <nav aria-labelledby="footer-links" className="text-sm text-gray-300">
          <h3 id="footer-links" className="text-xl font-bold text-[#DEC01F] mb-3">
            Enlaces Rápidos
          </h3>
          <ul className="space-y-2">
            {enlaces.map(({ id, title, to }) => (
              <li key={id}>
                <Link
                  to={to}
                  className="hover:text-[#DEC01F] transition-colors duration-200"
                >
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>

      {/* 🔸 Línea inferior */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#001F29] py-4 text-center text-xs text-gray-400 border-t border-white/10"
      >
        © {new Date().getFullYear()}{" "}
        <span className="text-[#DEC01F] font-semibold">
          ENAP Refinería Aconcagua
        </span>
        . Sistema de Reservas — Desarrollado por{" "}
        <strong className="text-white/90">ManuDev</strong>.
      </motion.div>
    </footer>
  );
};

export default Footer;
