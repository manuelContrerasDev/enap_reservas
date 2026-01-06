import React from "react";
import { AuthProvider } from "@/context/auth";
import { ThemeProvider } from "@/context/ThemeContext";
import { NotificacionProvider } from "@/context/NotificacionContext";

interface Props {
  children: React.ReactNode;
}

export function AppProviders({ children }: Props) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificacionProvider>
          {children}
        </NotificacionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
