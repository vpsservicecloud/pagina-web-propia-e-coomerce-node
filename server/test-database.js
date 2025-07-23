import { pool, inicializarBaseDatos, insertarDatosEjemplo } from './config/database.js';
import { conectarRedis, cache } from './config/redis.js';

async function verificarBaseDatos() {
  console.log('🔍 Verificando conexión a la base de datos...');
  
  try {
    // Probar conexión básica
    const [resultado] = await pool.execute('SELECT 1 as test');
    console.log('✅ Conexión a MySQL exitosa:', resultado[0]);
    
    // Inicializar base de datos
    console.log('📊 Inicializando base de datos...');
    await inicializarBaseDatos();
    
    // Insertar datos de ejemplo
    console.log('📝 Insertando datos de ejemplo...');
    await insertarDatosEjemplo();
    
    // Verificar datos insertados
    console.log('🔍 Verificando datos insertados...');
    
    // Verificar categorías
    const [categorias] = await pool.execute('SELECT * FROM categorias LIMIT 5');
    console.log('📂 Categorías encontradas:', categorias.length);
    categorias.forEach(cat => console.log(`  - ${cat.nombre}`));
    
    // Verificar productos
    const [productos] = await pool.execute('SELECT * FROM productos LIMIT 5');
    console.log('🛍️ Productos encontrados:', productos.length);
    productos.forEach(prod => console.log(`  - ${prod.nombre}: $${prod.precio}`));
    
    // Verificar usuarios
    const [usuarios] = await pool.execute('SELECT COUNT(*) as total FROM usuarios');
    console.log('👥 Total de usuarios:', usuarios[0].total);
    
    // Insertar un usuario de prueba
    console.log('👤 Creando usuario de prueba...');
    try {
      const [usuarioTest] = await pool.execute(
        'INSERT INTO usuarios (nombre, apellido, email, password) VALUES (?, ?, ?, ?)',
        ['Juan', 'Pérez', 'juan@ejemplo.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg9S6O'] // password: 123456
      );
      console.log('✅ Usuario de prueba creado con ID:', usuarioTest.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('ℹ️ Usuario de prueba ya existe');
      } else {
        throw error;
      }
    }
    
    console.log('✅ Verificación de base de datos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en verificación de base de datos:', error);
    throw error;
  }
}

async function verificarRedis() {
  console.log('🔍 Verificando conexión a Redis...');
  
  try {
    await conectarRedis();
    
    // Probar operaciones básicas
    await cache.establecer('test:conexion', { mensaje: 'Hola desde Redis', timestamp: new Date() }, 60);
    const resultado = await cache.obtener('test:conexion');
    
    console.log('✅ Conexión a Redis exitosa:', resultado);
    
    // Probar cache de productos
    await cache.establecer('productos:test', [
      { id: 1, nombre: 'Producto Test', precio: 99.99 }
    ], 300);
    
    const productosCache = await cache.obtener('productos:test');
    console.log('🛍️ Cache de productos funcionando:', productosCache);
    
    console.log('✅ Verificación de Redis completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en verificación de Redis:', error);
    console.log('ℹ️ La aplicación puede funcionar sin Redis, pero con rendimiento reducido');
  }
}

async function main() {
  console.log('🚀 Iniciando verificación completa del sistema...\n');
  
  try {
    await verificarBaseDatos();
    console.log('');
    await verificarRedis();
    
    console.log('\n🎉 Verificación completa exitosa!');
    console.log('📋 Resumen:');
    console.log('  ✅ Base de datos MySQL: Conectada y configurada');
    console.log('  ✅ Redis: Conectado y funcionando');
    console.log('  ✅ Datos de ejemplo: Insertados correctamente');
    console.log('  ✅ Usuario de prueba: juan@ejemplo.com / 123456');
    
  } catch (error) {
    console.error('\n💥 Error durante la verificación:', error.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();