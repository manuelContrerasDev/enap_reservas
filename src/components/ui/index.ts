// src/components/ui/index.ts

export * from "./base";
export * from "./feedback";
export * from "./loaders";

//REGLAS DE USO : 
/*  

🧭 REGLAS DE USO (guárdalas)

NO usar LoaderScreen dentro de páginas
NO usar LoaderPage en botones
Spinner → solo visual
LoaderInline → pequeños estados
LoaderPage → página completa
LoaderScreen → boot / auth
LoaderTransition → cambios de módulo / pago

*/