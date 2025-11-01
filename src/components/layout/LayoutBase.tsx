import React, { ReactNode, useState, Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import LoaderTransition from "../ui/LoaderTransition";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

const LOADER_MIN_MS = 300;   // tiempo mínimo visible de la transición
const LOADER_MAX_MS = 1200;  // tope de seguridad si algo sale mal
const SAME_ROUTE_GUARD_MS = 120; // cancela si no hay cambio real de ruta

const LayoutBase: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  const variants = {
    header: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    },
    main: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
      exit: { opacity: 0, y: -15, transition: { duration: 0.25, ease: "easeIn" } },
    },
    footer: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
    },
  };

  // 🔔 Lo llama el Header al hacer click en un link/acción de navegación
  const handleRouteChange = () => {
    setIsLoading(true);
  };

  // 🛡️ 1) Si activaste el loader pero NO cambió la ruta, lo apagamos rápido
  useEffect(() => {
    if (!isLoading) return;
    const guard = setTimeout(() => {
      if (location.pathname === lastPathRef.current) {
        setIsLoading(false);
      }
    }, SAME_ROUTE_GUARD_MS);

    // 🛡️ 2) Tope absoluto de seguridad
    const hardStop = setTimeout(() => setIsLoading(false), LOADER_MAX_MS);

    return () => {
      clearTimeout(guard);
      clearTimeout(hardStop);
    };
  }, [isLoading, location.pathname]);

  // ✅ 3) Cuando realmente cambia la ruta, cierra el loader tras la mínima animación
  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname;
      const t = setTimeout(() => setIsLoading(false), LOADER_MIN_MS);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#1A1A1A] transition-colors duration-300"
      role="application"
    >
      {/* 🔷 Header global */}
      <Header variants={variants} onRouteChange={handleRouteChange} />

      {/* 💫 Transición entre rutas */}
      <AnimatePresence mode="sync">
        {isLoading && (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center z-[9999] bg-[#002E3E]/80 backdrop-blur-sm pointer-events-none" // 👈 no bloquea clics
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoaderTransition />
          </motion.div>
        )}

        <motion.main
          key={location.pathname}
          variants={variants.main}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1 max-w-7xl mx-auto w-full px-6 py-10"
          role="main"
        >
          <Suspense fallback={<LoaderTransition />}>
            {children ?? <Outlet />}
          </Suspense>
        </motion.main>
      </AnimatePresence>

      {/* 🟨 Footer */}
      <motion.footer
        variants={variants.footer}
        initial="initial"
        animate="animate"
        className="mt-auto border-t border-[#DEC01F]/40"
        role="contentinfo"
      >
        <Footer />
      </motion.footer>
    </div>
  );
};

export default LayoutBase;
