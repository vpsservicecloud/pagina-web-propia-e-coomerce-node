import mysql from 'mysql2/promise';

// Configuración simple para MySQL local
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecommerce_db',
  authPlugins: {
    mysql_clear_password: () => () => {},
  }
};

// Crear pool de conexiones simple
const pool = mysql.createPool(dbConfig);

// Función para verificar conexión
async function verificarConexion() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a MySQL:', error.message);
    return false;
  }
}

export { pool, verificarConexion };