const redis = require('redis');
require('dotenv').config();

// Configuración de Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
};

// Crear cliente de Redis
const cliente = redis.createClient(redisConfig);

// Manejo de eventos
cliente.on('connect', () => {
  console.log('✅ Conectado a Redis');
});

cliente.on('error', (error) => {
  console.error('❌ Error de Redis:', error);
});

cliente.on('ready', () => {
  console.log('✅ Redis listo para usar');
});

// Conectar a Redis
async function conectarRedis() {
  try {
    await cliente.connect();
  } catch (error) {
    console.error('❌ Error al conectar con Redis:', error);
  }
}

// Funciones de utilidad para cache
const cache = {
  // Obtener valor del cache
  async obtener(clave) {
    try {
      const valor = await cliente.get(clave);
      return valor ? JSON.parse(valor) : null;
    } catch (error) {
      console.error('Error al obtener del cache:', error);
      return null;
    }
  },

  // Establecer valor en cache
  async establecer(clave, valor, expiracion = 3600) {
    try {
      await cliente.setEx(clave, expiracion, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error('Error al establecer en cache:', error);
      return false;
    }
  },

  // Eliminar valor del cache
  async eliminar(clave) {
    try {
      await cliente.del(clave);
      return true;
    } catch (error) {
      console.error('Error al eliminar del cache:', error);
      return false;
    }
  },

  // Limpiar cache por patrón
  async limpiarPatron(patron) {
    try {
      const claves = await cliente.keys(patron);
      if (claves.length > 0) {
        await cliente.del(claves);
      }
      return true;
    } catch (error) {
      console.error('Error al limpiar cache por patrón:', error);
      return false;
    }
  },

  // Incrementar contador
  async incrementar(clave, cantidad = 1) {
    try {
      return await cliente.incrBy(clave, cantidad);
    } catch (error) {
      console.error('Error al incrementar contador:', error);
      return 0;
    }
  },

  // Establecer con expiración
  async establecerConExpiracion(clave, valor, segundos) {
    try {
      await cliente.setEx(clave, segundos, JSON.stringify(valor));
      return true;
    } catch (error) {
      console.error('Error al establecer con expiración:', error);
      return false;
    }
  }
};

// Funciones específicas para el e-commerce
const cacheEcommerce = {
  // Cache de productos
  async obtenerProductos(filtros = {}) {
    const clave = `productos:${JSON.stringify(filtros)}`;
    return await cache.obtener(clave);
  },

  async establecerProductos(filtros, productos) {
    const clave = `productos:${JSON.stringify(filtros)}`;
    return await cache.establecer(clave, productos, 1800); // 30 minutos
  },

  // Cache de producto individual
  async obtenerProducto(id) {
    return await cache.obtener(`producto:${id}`);
  },

  async establecerProducto(id, producto) {
    return await cache.establecer(`producto:${id}`, producto, 3600); // 1 hora
  },

  // Cache de carrito
  async obtenerCarrito(usuarioId, sessionId) {
    const clave = usuarioId ? `carrito:usuario:${usuarioId}` : `carrito:session:${sessionId}`;
    return await cache.obtener(clave);
  },

  async establecerCarrito(usuarioId, sessionId, carrito) {
    const clave = usuarioId ? `carrito:usuario:${usuarioId}` : `carrito:session:${sessionId}`;
    return await cache.establecer(clave, carrito, 86400); // 24 horas
  },

  async eliminarCarrito(usuarioId, sessionId) {
    const clave = usuarioId ? `carrito:usuario:${usuarioId}` : `carrito:session:${sessionId}`;
    return await cache.eliminar(clave);
  },

  // Cache de categorías
  async obtenerCategorias() {
    return await cache.obtener('categorias');
  },

  async establecerCategorias(categorias) {
    return await cache.establecer('categorias', categorias, 7200); // 2 horas
  },

  // Estadísticas en tiempo real
  async incrementarVistaProducto(productoId) {
    return await cache.incrementar(`vistas:producto:${productoId}`);
  },

  async obtenerProductosMasVistos() {
    return await cache.obtener('productos:mas_vistos');
  },

  async establecerProductosMasVistos(productos) {
    return await cache.establecer('productos:mas_vistos', productos, 3600);
  }
};

module.exports = {
  cliente,
  conectarRedis,
  cache,
  cacheEcommerce
};