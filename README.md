# 🏕️ ENAP Reservas — MVP Sistema de Gestión de Espacios Recreativos

**ENAP Reservas** es un sistema web desarrollado como MVP para la gestión de reservas de espacios recreativos del complejo **ENAP Limache**.  
Permite a usuarios y administradores visualizar, crear, confirmar y gestionar reservas de cabañas, zonas de picnic, piscinas y otros espacios.

---

## 🚀 Tecnologías principales

| Tipo | Tecnologías |
|------|--------------|
| **Frontend** | React + TypeScript + Vite |
| **Estilos** | Tailwind CSS + Framer Motion |
| **Backend / BaaS** | Supabase (PostgreSQL + Realtime) |
| **Infraestructura** | Deploy en Vercel |
| **Control de versiones** | Git / GitHub |

---

## ⚙️ Características del MVP

- 📅 **Módulo de Reservas:** creación, visualización, cancelación y cambio de estado (pendiente / confirmada / cancelada).  
- 🏠 **Módulo de Espacios:** catálogo administrable de cabañas, zonas y áreas recreativas.  
- 👤 **Autenticación básica:** diferenciación entre roles *admin* y *socio* (flujo adaptable a Supabase Auth).  
- 🔁 **Actualización en tiempo real** gracias al canal `postgres_changes` de Supabase.  
- 🧭 **Filtros dinámicos** por usuario, espacio, estado y rango de fechas.  
- 📊 **Panel administrativo** con KPIs de reservas, paginación y acciones rápidas.

---

## 🧱 Estructura de la Base de Datos

**Tablas principales:**

- `espacios`
  - id (uuid, PK)
  - nombre, tipo, capacidad, tarifa, descripción, imagen, activo, created_at
- `reservas`
  - id (uuid, PK)
  - usuario, espacio_id (FK), espacio_nombre, fechas, personas, total, estado, created_at, updated_at

---

## 🧩 Configuración del entorno

### Variables de entorno (`.env.local`)
```bash
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY



npm install     # Instalar dependencias
npm run dev     # Iniciar entorno local
npm run build   # Compilar para producción
npm run preview # Servir build localmente



{
  "version": 2,
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
