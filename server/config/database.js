import mysql from 'mysql2/promise';
import 'dotenv/config';

// Configuración de la conexión a MySQL
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig);

// Función para inicializar la base de datos
async function inicializarBaseDatos() {
  try {
    // Crear base de datos si no existe
    const conexionSinDB = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });

    await conexionSinDB.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await conexionSinDB.end();

    // Crear tablas
    await crearTablas();
    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
    throw error;
  }
}

// Función para crear todas las tablas
async function crearTablas() {
  const conexion = await pool.getConnection();
  
  try {
    // Tabla de usuarios
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        telefono VARCHAR(20),
        fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT TRUE,
        rol ENUM('cliente', 'admin') DEFAULT 'cliente',
        email_verificado BOOLEAN DEFAULT FALSE,
        token_verificacion VARCHAR(255),
        INDEX idx_email (email),
        INDEX idx_activo (activo)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de categorías
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        imagen VARCHAR(255),
        activo BOOLEAN DEFAULT TRUE,
        orden INT DEFAULT 0,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_activo (activo),
        INDEX idx_orden (orden)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de productos
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        precio_oferta DECIMAL(10,2),
        categoria_id INT,
        stock INT DEFAULT 0,
        sku VARCHAR(100) UNIQUE,
        peso DECIMAL(8,2),
        dimensiones VARCHAR(100),
        imagen_principal VARCHAR(255),
        activo BOOLEAN DEFAULT TRUE,
        destacado BOOLEAN DEFAULT FALSE,
        nuevo BOOLEAN DEFAULT FALSE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
        INDEX idx_categoria (categoria_id),
        INDEX idx_activo (activo),
        INDEX idx_destacado (destacado),
        INDEX idx_precio (precio),
        INDEX idx_stock (stock),
        FULLTEXT idx_busqueda (nombre, descripcion)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de imágenes de productos
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS producto_imagenes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        url VARCHAR(255) NOT NULL,
        alt_text VARCHAR(255),
        orden INT DEFAULT 0,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
        INDEX idx_producto (producto_id),
        INDEX idx_orden (orden)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de especificaciones de productos
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS producto_especificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        producto_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        valor VARCHAR(255) NOT NULL,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
        INDEX idx_producto (producto_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de direcciones
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS direcciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        nombre VARCHAR(100) NOT NULL,
        direccion TEXT NOT NULL,
        ciudad VARCHAR(100) NOT NULL,
        estado VARCHAR(100),
        codigo_postal VARCHAR(20) NOT NULL,
        pais VARCHAR(100) NOT NULL,
        telefono VARCHAR(20),
        es_predeterminada BOOLEAN DEFAULT FALSE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id),
        INDEX idx_predeterminada (es_predeterminada)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de carritos
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS carritos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT,
        session_id VARCHAR(255),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id),
        INDEX idx_session (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de items del carrito
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS carrito_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        carrito_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL DEFAULT 1,
        precio DECIMAL(10,2) NOT NULL,
        fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
        UNIQUE KEY unique_carrito_producto (carrito_id, producto_id),
        INDEX idx_carrito (carrito_id),
        INDEX idx_producto (producto_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de pedidos
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        numero_pedido VARCHAR(50) UNIQUE NOT NULL,
        usuario_id INT NOT NULL,
        direccion_envio_id INT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        impuestos DECIMAL(10,2) NOT NULL DEFAULT 0,
        envio DECIMAL(10,2) NOT NULL DEFAULT 0,
        descuento DECIMAL(10,2) NOT NULL DEFAULT 0,
        total DECIMAL(10,2) NOT NULL,
        estado ENUM('pendiente', 'confirmado', 'procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente',
        metodo_pago VARCHAR(50),
        notas TEXT,
        fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
        FOREIGN KEY (direccion_envio_id) REFERENCES direcciones(id),
        INDEX idx_usuario (usuario_id),
        INDEX idx_estado (estado),
        INDEX idx_fecha (fecha_pedido),
        INDEX idx_numero (numero_pedido)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de items del pedido
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS pedido_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id),
        INDEX idx_pedido (pedido_id),
        INDEX idx_producto (producto_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de favoritos
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS favoritos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        producto_id INT NOT NULL,
        fecha_agregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
        UNIQUE KEY unique_usuario_producto (usuario_id, producto_id),
        INDEX idx_usuario (usuario_id),
        INDEX idx_producto (producto_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de notificaciones
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS notificaciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        tipo ENUM('pedido', 'producto', 'promocion', 'sistema') NOT NULL,
        titulo VARCHAR(255) NOT NULL,
        mensaje TEXT NOT NULL,
        leida BOOLEAN DEFAULT FALSE,
        datos_extra JSON,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id),
        INDEX idx_leida (leida),
        INDEX idx_tipo (tipo),
        INDEX idx_fecha (fecha_creacion)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Tabla de sesiones
    await conexion.execute(`
      CREATE TABLE IF NOT EXISTS sesiones (
        id VARCHAR(255) PRIMARY KEY,
        usuario_id INT,
        datos JSON,
        expira TIMESTAMP NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        INDEX idx_usuario (usuario_id),
        INDEX idx_expira (expira)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Todas las tablas creadas correctamente');
  } finally {
    conexion.release();
  }
}

// Función para insertar datos de ejemplo
async function insertarDatosEjemplo() {
  const conexion = await pool.getConnection();
  
  try {
    // Verificar si ya hay datos
    const [categorias] = await conexion.execute('SELECT COUNT(*) as count FROM categorias');
    if (categorias[0].count > 0) {
      console.log('✅ Los datos de ejemplo ya existen');
      return;
    }

    // Insertar categorías
    await conexion.execute(`
      INSERT INTO categorias (nombre, descripcion, activo, orden) VALUES
      ('Ropa', 'Ropa para hombre y mujer', TRUE, 1),
      ('Calzado', 'Zapatos y zapatillas', TRUE, 2),
      ('Accesorios', 'Complementos y accesorios', TRUE, 3),
      ('Electrónicos', 'Dispositivos electrónicos', TRUE, 4),
      ('Hogar', 'Artículos para el hogar', TRUE, 5),
      ('Belleza', 'Productos de belleza y cuidado personal', TRUE, 6)
    `);

    // Insertar productos de ejemplo
    await conexion.execute(`
      INSERT INTO productos (nombre, descripcion, precio, categoria_id, stock, sku, activo, destacado, nuevo, imagen_principal) VALUES
      ('Camiseta Premium', 'Camiseta de algodón 100% premium con corte moderno y acabados de alta calidad.', 29.99, 1, 50, 'CAM001', TRUE, TRUE, TRUE, 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg'),
      ('Jeans Clásicos', 'Jeans de corte clásico con denim de alta calidad y ajuste perfecto.', 59.99, 1, 30, 'JEA001', TRUE, TRUE, TRUE, 'https://images.pexels.com/photos/4210866/pexels-photo-4210866.jpeg'),
      ('Zapatillas Deportivas', 'Zapatillas deportivas con tecnología de amortiguación avanzada para máximo confort.', 89.99, 2, 25, 'ZAP001', TRUE, TRUE, FALSE, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg'),
      ('Reloj Minimalista', 'Reloj de diseño minimalista con correa de cuero genuino y movimiento de cuarzo.', 120.00, 3, 15, 'REL001', TRUE, FALSE, FALSE, 'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg'),
      ('Auriculares Inalámbricos', 'Auriculares inalámbricos con cancelación de ruido y batería de larga duración.', 149.99, 4, 20, 'AUR001', TRUE, TRUE, TRUE, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'),
      ('Mochila Urbana', 'Mochila urbana resistente al agua con compartimento para laptop y múltiples bolsillos.', 79.99, 3, 35, 'MOC001', TRUE, FALSE, FALSE, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg')
    `);

    console.log('✅ Datos de ejemplo insertados correctamente');
  } finally {
    conexion.release();
  }
}

export {
  pool,
  inicializarBaseDatos,
  insertarDatosEjemplo
};