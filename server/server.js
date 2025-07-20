const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configuraciones
const { inicializarBaseDatos, insertarDatosEjemplo } = require('./config/database');
const { conectarRedis } = require('./config/redis');
const { manejarConexiones } = require('./sockets/socketHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const carritoRoutes = require('./routes/carrito');

const app = express();
const server = http.createServer(app);

// Configurar Socket.IO con CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware de seguridad
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// Configurar CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-session-id']
}));

// Middleware de compresión
app.use(compression());

// Middleware de logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: {
    exito: false,
    mensaje: 'Demasiadas solicitudes, intenta de nuevo más tarde'
  }
});
app.use('/api/', limiter);

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para agregar io al request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware para rutas no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada'
  });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  res.status(error.status || 500).json({
    exito: false,
    mensaje: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Configurar Socket.IO
manejarConexiones(io);

// Función para inicializar el servidor
async function inicializarServidor() {
  try {
    console.log('🚀 Iniciando servidor...');
    
    // Inicializar base de datos
    console.log('📊 Inicializando base de datos...');
    await inicializarBaseDatos();
    await insertarDatosEjemplo();
    
    // Conectar a Redis
    console.log('🔴 Conectando a Redis...');
    await conectarRedis();
    
    // Iniciar servidor
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`✅ Servidor ejecutándose en puerto ${PORT}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`🔌 WebSocket URL: ws://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Error al inicializar servidor:', error);
    process.exit(1);
  }
}

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

// Inicializar servidor
inicializarServidor();

module.exports = { app, server, io };