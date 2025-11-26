// src/components/layout/LayoutBase.tsx
import React, { ReactNode, useState, Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import LoaderTransition from "../ui/LoaderTransition";
import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { useAuth } from "../../context/AuthContext";
import InviteGuestButton from "../socio/inviteGuestButton";

const LOADER_MIN_MS = 300;
const LOADER_MAX_MS = 1200;
const SAME_ROUTE_GUARD_MS = 120;

const LayoutBase: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  const { userRole } = useAuth();
  const role = (userRole ?? "").toLowerCase();

  const variants = {
    header: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4 } } },
    main: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      exit: { opacity: 0, y: -15, transition: { duration: 0.25 } },
    },
    footer: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
    },
  };

  const handleRouteChange = () => setIsLoading(true);

  // Si se activó loader pero no hay ruta nueva → cancelar
  useEffect(() => {
    if (!isLoading) return;

    const guard = setTimeout(() => {
      if (location.pathname === lastPathRef.current) {
        setIsLoading(false);
      }
    }, SAME_ROUTE_GUARD_MS);

    const hardStop = setTimeout(() => setIsLoading(false), LOADER_MAX_MS);

    return () => {
      clearTimeout(guard);
      clearTimeout(hardStop);
    };
  }, [isLoading, location.pathname]);

  // Cuando cambia realmente la ruta → cerrar loader
  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname;
      const t = setTimeout(() => setIsLoading(false), LOADER_MIN_MS);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#1A1A1A] transition-colors duration-300">
      
      <Header
        variants={variants}
        onRouteChange={handleRouteChange}
        extraActions={role === "socio" ? <InviteGuestButton /> : null}
      />

      <AnimatePresence mode="sync">
        {isLoading && (
          <motion.div
            key="loader"
            className="fixed inset-0 flex items-center justify-center z-[9999] bg-[#002E3E]/80 backdrop-blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
        >
          <Suspense fallback={<LoaderTransition />}>
            {children ?? <Outlet />}
          </Suspense>
        </motion.main>
      </AnimatePresence>

      <motion.footer
        variants={variants.footer}
        initial="initial"
        animate="animate"
        className="mt-auto border-t border-[#DEC01F]/40"
      >
        <Footer />
      </motion.footer>
    </div>
  );
};

export default LayoutBase;
