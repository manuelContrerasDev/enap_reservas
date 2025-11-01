/*
  🌴 ENAP Limache – Seed de demostración (MVP)
  Crea estructura base + datos de ejemplo para mostrar el sistema en funcionamiento.
*/

-- =======================================
-- 🏗️ Crear tablas si no existen
-- =======================================

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

CREATE TABLE IF NOT EXISTS reservas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario text NOT NULL,
  espacio_id uuid REFERENCES espacios(id) ON DELETE CASCADE,
  espacio_nombre text NOT NULL,
  fecha_inicio date NOT NULL,
  fecha_fin date NOT NULL,
  personas integer NOT NULL DEFAULT 1,
  total integer NOT NULL DEFAULT 0,
  estado text NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- =======================================
-- 🔒 Configuración de seguridad
-- =======================================

ALTER TABLE espacios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Public can view active espacios"
  ON espacios FOR SELECT
  USING (activo = true);

CREATE POLICY IF NOT EXISTS "Anyone can insert reservas"
  ON reservas FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Anyone can view reservas"
  ON reservas FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Anyone can update reservas"
  ON reservas FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- =======================================
-- 🌿 Insertar espacios de ejemplo
-- =======================================

INSERT INTO espacios (nombre, tipo, capacidad, tarifa, descripcion, imagen, activo)
VALUES
  ('Cabaña Los Robles', 'Cabaña', 4, 45000, 'Cabaña equipada con vista al bosque.', 'https://placehold.co/400x250?text=Cabaña+Los+Robles', true),
  ('Zona Picnic A', 'Zona', 10, 25000, 'Espacio amplio con quincho y parrilla.', 'https://placehold.co/400x250?text=Zona+Picnic+A', true),
  ('Cabaña La Loma', 'Cabaña', 6, 55000, 'Ideal para familias, incluye estacionamiento.', 'https://placehold.co/400x250?text=Cabaña+La+Loma', true),
  ('Piscina Central', 'Piscina', 30, 15000, 'Piscina principal con áreas de descanso y salvavidas.', 'https://placehold.co/400x250?text=Piscina+Central', true),
  ('Parque Los Pinos', 'Parque', 50, 10000, 'Zona verde ideal para caminatas, picnic y actividades recreativas.', 'https://placehold.co/400x250?text=Parque+Los+Pinos', true),
  ('Cabaña El Encanto', 'Cabaña', 5, 48000, 'Cabaña acogedora con terraza y vista panorámica al valle.', 'https://placehold.co/400x250?text=Cabaña+El+Encanto', true)
ON CONFLICT DO NOTHING;

-- =======================================
-- 📅 Insertar reservas de ejemplo
-- =======================================

DO $$
DECLARE
  id_robles uuid;
  id_piscina uuid;
  id_parque uuid;
  id_encanto uuid;
BEGIN
  SELECT id INTO id_robles FROM espacios WHERE nombre = 'Cabaña Los Robles' LIMIT 1;
  SELECT id INTO id_piscina FROM espacios WHERE nombre = 'Piscina Central' LIMIT 1;
  SELECT id INTO id_parque FROM espacios WHERE nombre = 'Parque Los Pinos' LIMIT 1;
  SELECT id INTO id_encanto FROM espacios WHERE nombre = 'Cabaña El Encanto' LIMIT 1;

  -- Reserva original
  IF id_robles IS NOT NULL THEN
    INSERT INTO reservas (usuario, espacio_id, espacio_nombre, fecha_inicio, fecha_fin, personas, total, estado)
    VALUES ('Carlos Soto', id_robles, 'Cabaña Los Robles', '2025-10-28', '2025-10-30', 4, 90000, 'pendiente')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Reservas nuevas
  IF id_piscina IS NOT NULL THEN
    INSERT INTO reservas (usuario, espacio_id, espacio_nombre, fecha_inicio, fecha_fin, personas, total, estado)
    VALUES ('María González', id_piscina, 'Piscina Central', '2025-11-02', '2025-11-02', 8, 120000, 'confirmada')
    ON CONFLICT DO NOTHING;
  END IF;

  IF id_parque IS NOT NULL THEN
    INSERT INTO reservas (usuario, espacio_id, espacio_nombre, fecha_inicio, fecha_fin, personas, total, estado)
    VALUES ('Diego Rojas', id_parque, 'Parque Los Pinos', '2025-11-05', '2025-11-06', 10, 100000, 'pendiente')
    ON CONFLICT DO NOTHING;
  END IF;
 
  IF id_encanto IS NOT NULL THEN
    INSERT INTO reservas (usuario, espacio_id, espacio_nombre, fecha_inicio, fecha_fin, personas, total, estado)
    VALUES ('Paula Fernández', id_encanto, 'Cabaña El Encanto', '2025-11-10', '2025-11-12', 4, 96000, 'cancelada')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =======================================
-- ✅ Confirmación final
-- =======================================
COMMENT ON DATABASE current_database() IS 'Seed Demo ENAP Limache – Espacios y Reservas base para MVP.';
