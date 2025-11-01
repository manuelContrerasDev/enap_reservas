/*
  # ENAP Limache Database Schema — v2

  ## Mejoras incluidas
  - Políticas RLS reforzadas (seguridad y control de acceso)
  - Trigger automático para `updated_at`
  - Validación de fechas de reservas
  - Índices de rendimiento mejorados
  - Seeds iniciales consistentes
*/

-- ============================================
-- EXTENSIONES NECESARIAS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- para gen_random_uuid()

-- ============================================
-- TABLA: ESPACIOS
-- ============================================
CREATE TABLE IF NOT EXISTS espacios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  tipo text NOT NULL,
  capacidad integer NOT NULL DEFAULT 1,
  tarifa integer NOT NULL DEFAULT 0,
  descripcion text NOT NULL DEFAULT '',
  imagen text NOT NULL DEFAULT '',
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLA: RESERVAS
-- ============================================
CREATE TABLE IF NOT EXISTS reservas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario text NOT NULL,
  espacio_id uuid REFERENCES espacios(id) ON DELETE CASCADE,
  espacio_nombre text NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  personas integer NOT NULL DEFAULT 1,
  total integer NOT NULL DEFAULT 0,
  estado text NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT chk_fecha_valida CHECK (fecha_fin >= fecha_inicio)
);

-- ============================================
-- TRIGGER: actualización automática de updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_reservas_updated_at
BEFORE UPDATE ON reservas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- HABILITAR RLS
-- ============================================
ALTER TABLE espacios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS DE ESPACIOS
-- ============================================
DROP POLICY IF EXISTS "Public can view active espacios" ON espacios;
DROP POLICY IF EXISTS "Authenticated users can view all espacios" ON espacios;

CREATE POLICY "Public can view active espacios"
  ON espacios FOR SELECT
  USING (activo = true);

CREATE POLICY "Authenticated users can view all espacios"
  ON espacios FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- POLÍTICAS DE RESERVAS
-- ============================================
DROP POLICY IF EXISTS "Anyone can create reservas" ON reservas;
DROP POLICY IF EXISTS "Anyone can view reservas" ON reservas;
DROP POLICY IF EXISTS "Anyone can update reservas" ON reservas;
DROP POLICY IF EXISTS "Admins can delete reservas" ON reservas;

-- 👀 Leer: usuarios autenticados pueden ver sus propias reservas
CREATE POLICY "Users can view their own reservas"
  ON reservas FOR SELECT
  TO authenticated
  USING (auth.uid()::text = usuario);

-- 📝 Crear: usuarios autenticados pueden crear reservas a su nombre
CREATE POLICY "Users can create reservas as themselves"
  ON reservas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = usuario);

-- 🔁 Actualizar: usuarios autenticados pueden actualizar sus reservas
CREATE POLICY "Users can update their own reservas"
  ON reservas FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = usuario)
  WITH CHECK (auth.uid()::text = usuario);

-- 🗑️ Eliminar: solo administradores (rol service_role o backend)
CREATE POLICY "Admins can delete reservas from frontend"
  ON reservas FOR DELETE
  TO authenticated
  USING (
    auth.role() = 'authenticated'  -- solo usuarios autenticados
    AND usuario LIKE '%admin%'     -- o reemplaza con tu lógica real de admin
  );

-- ============================================
-- ÍNDICES DE RENDIMIENTO
-- ============================================
CREATE INDEX IF NOT EXISTS idx_espacios_activo ON espacios(activo);
CREATE INDEX IF NOT EXISTS idx_reservas_espacio_id ON reservas(espacio_id);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_inicio ON reservas(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha_fin ON reservas(fecha_fin);

-- ============================================
-- SEED DATA (demo inicial)
-- ============================================
INSERT INTO espacios (nombre, tipo, capacidad, tarifa, descripcion, imagen, activo)
VALUES
  ('Cabaña Los Robles', 'Cabaña', 4, 45000, 'Cabaña equipada con vista al bosque.', 'https://placehold.co/400x250?text=Cabaña+Los+Robles', true),
  ('Zona Picnic A', 'Zona', 10, 25000, 'Espacio amplio con quincho y parrilla.', 'https://placehold.co/400x250?text=Zona+Picnic+A', true),
  ('Cabaña La Loma', 'Cabaña', 6, 55000, 'Ideal para familias, incluye estacionamiento.', 'https://placehold.co/400x250?text=Cabaña+La+Loma', true)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  espacio_id_robles uuid;
BEGIN
  SELECT id INTO espacio_id_robles FROM espacios WHERE nombre = 'Cabaña Los Robles' LIMIT 1;

  IF espacio_id_robles IS NOT NULL THEN
    INSERT INTO reservas (usuario, espacio_id, espacio_nombre, fecha_inicio, fecha_fin, personas, total, estado)
    VALUES ('Carlos Soto', espacio_id_robles, 'Cabaña Los Robles', '2025-10-28', '2025-10-30', 4, 90000, 'pendiente')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
