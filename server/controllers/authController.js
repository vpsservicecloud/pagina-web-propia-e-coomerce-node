const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { cache } = require('../config/redis');

// Generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email,
      rol: usuario.rol 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Registrar usuario
const registrarUsuario = async (req, res) => {
  const conexion = await pool.getConnection();
  
  try {
    const { nombre, apellido, email, password, telefono } = req.body;

    // Validaciones
    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Todos los campos obligatorios deben ser completados'
      });
    }

    // Verificar si el email ya existe
    const [usuarioExistente] = await conexion.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarioExistente.length > 0) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El email ya está registrado'
      });
    }

    // Encriptar contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Insertar usuario
    const [resultado] = await conexion.execute(
      `INSERT INTO usuarios (nombre, apellido, email, password, telefono) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, apellido, email, passwordHash, telefono || null]
    );

    // Obtener usuario creado
    const [nuevoUsuario] = await conexion.execute(
      'SELECT id, nombre, apellido, email, telefono, fecha_registro FROM usuarios WHERE id = ?',
      [resultado.insertId]
    );

    // Generar token
    const token = generarToken(nuevoUsuario[0]);

    // Guardar sesión en cache
    await cache.establecer(`sesion:${nuevoUsuario[0].id}`, {
      usuario: nuevoUsuario[0],
      fechaInicio: new Date()
    }, 604800); // 7 días

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente',
      datos: {
        usuario: nuevoUsuario[0],
        token
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  } finally {
    conexion.release();
  }
};

// Iniciar sesión
const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const [usuarios] = await pool.execute(
      'SELECT id, nombre, apellido, email, password, telefono, rol, activo FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    const usuario = usuarios[0];

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Cuenta desactivada'
      });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    // Remover password del objeto usuario
    delete usuario.password;

    // Generar token
    const token = generarToken(usuario);

    // Guardar sesión en cache
    await cache.establecer(`sesion:${usuario.id}`, {
      usuario,
      fechaInicio: new Date()
    }, 604800); // 7 días

    res.json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso',
      datos: {
        usuario,
        token
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Cerrar sesión
const cerrarSesion = async (req, res) => {
  try {
    // Eliminar sesión del cache
    await cache.eliminar(`sesion:${req.usuario.id}`);

    res.json({
      exito: true,
      mensaje: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario
const obtenerPerfil = async (req, res) => {
  try {
    const [usuarios] = await pool.execute(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.fecha_registro,
              COUNT(d.id) as total_direcciones
       FROM usuarios u
       LEFT JOIN direcciones d ON u.id = d.usuario_id
       WHERE u.id = ?
       GROUP BY u.id`,
      [req.usuario.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      exito: true,
      datos: usuarios[0]
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Actualizar perfil
const actualizarPerfil = async (req, res) => {
  try {
    const { nombre, apellido, telefono } = req.body;

    // Validaciones
    if (!nombre || !apellido) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Nombre y apellido son requeridos'
      });
    }

    // Actualizar usuario
    await pool.execute(
      'UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ? WHERE id = ?',
      [nombre, apellido, telefono || null, req.usuario.id]
    );

    // Obtener usuario actualizado
    const [usuarioActualizado] = await pool.execute(
      'SELECT id, nombre, apellido, email, telefono FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    // Actualizar cache
    await cache.eliminar(`sesion:${req.usuario.id}`);

    res.json({
      exito: true,
      mensaje: 'Perfil actualizado exitosamente',
      datos: usuarioActualizado[0]
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    // Validaciones
    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Contraseña actual y nueva son requeridas'
      });
    }

    // Obtener contraseña actual
    const [usuarios] = await pool.execute(
      'SELECT password FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(passwordActual, usuarios[0].password);
    if (!passwordValida) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Contraseña actual incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const passwordHash = await bcrypt.hash(passwordNueva, 12);

    // Actualizar contraseña
    await pool.execute(
      'UPDATE usuarios SET password = ? WHERE id = ?',
      [passwordHash, req.usuario.id]
    );

    res.json({
      exito: true,
      mensaje: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword
};