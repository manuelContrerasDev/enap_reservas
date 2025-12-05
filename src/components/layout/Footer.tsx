import React, { ReactNode, useState, Suspense, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import LoaderTransition from "../ui/LoaderTransition";
import Footer from "../layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "../../context/AuthContext";

const LOADER_MIN_MS = 300;
const LOADER_MAX_MS = 1200;
const SAME_ROUTE_GUARD_MS = 120;

const LayoutBase: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  /* ───────────────────────────────
   * 🔄 ROUTE LOADING CONTROL
   * ─────────────────────────────── */
  const handleRouteChange = () => setIsLoading(true);

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

  useEffect(() => {
    if (location.pathname !== lastPathRef.current) {
      lastPathRef.current = location.pathname;
      const t = setTimeout(() => setIsLoading(false), LOADER_MIN_MS);
      return () => clearTimeout(t);
    }
  }, [location.pathname]);


  /* ───────────────────────────────
   * 🔵 LAYOUT PRINCIPAL CON SIDEBAR
   * ─────────────────────────────── */
  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1A1A1A]">

      {/* SIDEBAR — Desktop fijo */}
      <Sidebar />

      {/* CONTENEDOR GENERAL A LA DERECHA */}
      <div className="
        flex flex-col flex-1 
        md:ml-64     /* Desplazar contenido cuando sidebar está visible */
        ml-0         /* Mobile: sin margen */
        transition-all min-h-screen
      ">

        {/* LOADER GLOBAL */}
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

          {/* MAIN CONTENT */}
          <motion.main
            key={location.pathname}
            variants={{
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
            }}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 max-w-7xl mx-auto w-full px-6 py-10"
            onClick={handleRouteChange}
          >
            <Suspense fallback={<LoaderTransition />}>
              {children ?? <Outlet />}
            </Suspense>
          </motion.main>
        </AnimatePresence>

        {/* FOOTER FIJO Y RESPONSIVO */}
        <motion.footer
          variants={{
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
          initial="initial"
          animate="animate"
          className="mt-auto w-full"
        >
          <Footer />
        </motion.footer>
      </div>
    </div>
  );
};

export default LayoutBase;
