# E-Commerce con React y Supabase

Una aplicación de e-commerce moderna construida con React, TypeScript, Bootstrap y Supabase como backend.

## Características

- 🛍️ Catálogo de productos con filtros y búsqueda
- 🛒 Carrito de compras persistente
- 👤 Autenticación de usuarios con Supabase Auth
- 📱 Diseño responsive con Bootstrap
- 🎨 Interfaz moderna con Lucide React icons
- 🔒 Autenticación segura y gestión de sesiones

## Tecnologías

- **Frontend**: React 18, TypeScript, Bootstrap 5.3
- **Backend**: Supabase (Base de datos PostgreSQL + Auth + API)
- **Iconos**: Lucide React
- **Estilos**: Bootstrap + CSS personalizado

## Configuración

### 1. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ve a Settings > API para obtener tu URL y clave anónima
3. Copia el archivo `.env.example` a `.env` y completa las variables:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 2. Crear las tablas en Supabase

Ejecuta estos comandos SQL en el editor SQL de Supabase:

```sql
-- Tabla de perfiles de usuario
CREATE TABLE perfiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  telefono TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  precio_oferta DECIMAL(10,2),
  categoria TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  imagen TEXT NOT NULL,
  imagenes TEXT[],
  especificaciones JSONB,
  destacado BOOLEAN DEFAULT FALSE,
  nuevo BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de items del carrito
CREATE TABLE carrito_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  session_id TEXT,
  producto_id UUID REFERENCES productos ON DELETE CASCADE NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrito_items ENABLE ROW LEVEL SECURITY;

-- Políticas para perfiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON perfiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON perfiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar su propio perfil" ON perfiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para productos (lectura pública)
CREATE POLICY "Los productos son visibles para todos" ON productos
  FOR SELECT USING (activo = true);

-- Políticas para carrito
CREATE POLICY "Los usuarios pueden ver sus items del carrito" ON carrito_items
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Los usuarios pueden insertar items en su carrito" ON carrito_items
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Los usuarios pueden actualizar sus items del carrito" ON carrito_items
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Los usuarios pueden eliminar sus items del carrito" ON carrito_items
  FOR DELETE USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );
```

### 3. Insertar datos de ejemplo

```sql
-- Insertar productos de ejemplo
INSERT INTO productos (nombre, descripcion, precio, categoria, stock, imagen, destacado, nuevo) VALUES
('Camiseta Premium', 'Camiseta de algodón 100% premium con corte moderno y acabados de alta calidad.', 29.99, 'ropa', 50, 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg', true, true),
('Jeans Clásicos', 'Jeans de corte clásico con denim de alta calidad y ajuste perfecto.', 59.99, 'ropa', 30, 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg', true, true),
('Zapatillas Deportivas', 'Zapatillas deportivas con tecnología de amortiguación avanzada para máximo confort.', 89.99, 'calzado', 25, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', true, false),
('Reloj Minimalista', 'Reloj de diseño minimalista con correa de cuero genuino y movimiento de cuarzo.', 120.00, 'accesorios', 15, 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg', false, false),
('Auriculares Inalámbricos', 'Auriculares inalámbricos con cancelación de ruido y batería de larga duración.', 149.99, 'electronicos', 20, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', true, true),
('Mochila Urbana', 'Mochila urbana resistente al agua con compartimento para laptop y múltiples bolsillos.', 79.99, 'accesorios', 35, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg', false, false);
```

### 4. Instalar dependencias y ejecutar

```bash
npm install
npm run dev
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── context/            # Contextos de React (Auth, Carrito)
├── data/               # Datos y configuraciones
├── hooks/              # Hooks personalizados
├── lib/                # Configuración de librerías (Supabase)
├── pages/              # Páginas de la aplicación
├── services/           # Servicios de API (Supabase)
├── types/              # Tipos de TypeScript
└── main.tsx           # Punto de entrada
```

## Funcionalidades

### Autenticación
- Registro de usuarios
- Inicio de sesión
- Gestión de perfil
- Sesiones persistentes

### Productos
- Catálogo con paginación
- Filtros por categoría y precio
- Búsqueda de productos
- Productos destacados y nuevos

### Carrito
- Agregar/eliminar productos
- Actualizar cantidades
- Persistencia para usuarios anónimos y autenticados
- Cálculo automático de totales

### Interfaz
- Diseño responsive
- Navegación intuitiva
- Componentes reutilizables
- Animaciones y transiciones

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.