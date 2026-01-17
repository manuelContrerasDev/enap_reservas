/*

// src/lib/pdf/generarComprobanteReserva.ts

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ReservaFrontend } from "@/types/ReservaFrontend";

export async function generarComprobanteReservaPDF(reserva: ReservaFrontend) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // tamaño carta

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  let y = 780;

  const draw = (text: string, size = 12, bold = false) => {
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0, 0, 0),
    });
    y -= size + 8;
  };

  // ===============================
  //  HEADER
  // ===============================
  draw("ENAP - Comprobante de Reserva", 20, true);
  y -= 10;

  draw(`Reserva ID: ${reserva.id}`, 12);
  draw(`Espacio: ${reserva.espacioNombre}`, 12);
  draw(`Tipo: ${reserva.espacioTipo}`, 12);

  y -= 15;

  // ===============================
  //  FECHAS
  // ===============================
  draw("Fechas de la reserva:", 14, true);
  draw(`Inicio: ${new Date(reserva.fechaInicio).toLocaleDateString("es-CL")}`);
  draw(`Fin: ${new Date(reserva.fechaFin).toLocaleDateString("es-CL")}`);
  draw(`Días: ${reserva.dias}`);

  y -= 15;

  // ===============================
  //  DATOS SOCIO
  // ===============================
  draw("Datos del usuario:", 14, true);
  draw(`Socio: ${reserva.usuario.nombre}`);
  draw(`Email: ${reserva.usuario.email}`);

  y -= 15;

  // ===============================
  //  DETALLE
  // ===============================
  draw("Detalle:", 14, true);
  draw(`Personas: ${reserva.cantidadPersonas}`);
  draw(`Estado: ${reserva.estado}`);

  y -= 15;

  // ===============================
  //  MONTO
  // ===============================
  draw("Monto total:", 14, true);
  draw(`CLP ${reserva.totalClp.toLocaleString("es-CL")}`);

  // Footer
  page.drawText("Documento generado digitalmente - ENAP", {
    x: 150,
    y: 30,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  const bytes = await pdf.save();

  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `reserva_${reserva.id}.pdf`;
  a.click();
}*/
