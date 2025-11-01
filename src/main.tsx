// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./index.css";
import "@fontsource-variable/inter";                 // 'Inter Variable'
import "@fontsource-variable/plus-jakarta-sans";

// 🧩 Contextos globales
import { AuthProvider } from "./context/AuthContext";
import { ReservaProvider } from "./context/ReservaContext";
import { NotificacionProvider } from "./context/NotificacionContext";
import { EspaciosProvider } from "./context/EspaciosContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <NotificacionProvider>
            <ReservaProvider>
              <EspaciosProvider>
                <ThemeProvider>
                  <App />
                </ThemeProvider>
              </EspaciosProvider>
            </ReservaProvider>
          </NotificacionProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
