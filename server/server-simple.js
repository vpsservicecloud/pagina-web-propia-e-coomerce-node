import express from 'express';
import cors from 'cors';
import { verificarConexion } from './config/database-simple.js';

const app = express();
const PORT = 3001;

// Middleware básico
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Servidor backend funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Ruta para verificar base de datos
app.get('/health', async (req, res) => {
  const dbOk = await verificarConexion();
  res.json({
    server: 'OK',
    database: dbOk ? 'OK' : 'ERROR',
    timestamp: new Date().toISOString()
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  
  // Verificar conexión a la base de datos
  verificarConexion();
});

export { app };