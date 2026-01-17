import React from "react";
import { AuthProvider } from "@/modules/auth/context/AuthContext";
import { ThemeProvider } from "@/shared/providers/ThemeProvider";
import { NotificacionProvider } from "@/shared/providers/NotificacionProvider";

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
