import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';

// Middleware para verificar autenticación
const verificarAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token de acceso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe y está activo
    const [usuarios] = await pool.execute(
      'SELECT id, nombre, apellido, email, rol, activo FROM usuarios WHERE id = ? AND activo = TRUE',
      [decoded.id]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no válido'
      });
    }

    req.usuario = usuarios[0];
    next();
  } catch (error) {
    console.error('Error en verificación de auth:', error);
    return res.status(401).json({
      exito: false,
      mensaje: 'Token no válido'
    });
  }
};

// Middleware para verificar rol de administrador
const verificarAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({
      exito: false,
      mensaje: 'Acceso denegado. Se requieren permisos de administrador'
    });
  }
  next();
};

// Middleware para obtener usuario opcional (no requerido)
const usuarioOpcional = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const [usuarios] = await pool.execute(
        'SELECT id, nombre, apellido, email, rol, activo FROM usuarios WHERE id = ? AND activo = TRUE',
        [decoded.id]
      );

      if (usuarios.length > 0) {
        req.usuario = usuarios[0];
      }
    }
    
    next();
  } catch (error) {
    // Si hay error en el token, continuar sin usuario
    next();
  }
};

export {
  verificarAuth,
  verificarAdmin,
  usuarioOpcional
};