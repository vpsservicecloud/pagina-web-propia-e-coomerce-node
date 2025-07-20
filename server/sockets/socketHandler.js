const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Manejar conexiones de WebSocket
const manejarConexiones = (io) => {
  io.on('connection', (socket) => {
    console.log(`✅ Cliente conectado: ${socket.id}`);

    // Autenticar usuario si proporciona token
    socket.on('autenticar', async (token) => {
      try {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          const [usuarios] = await pool.execute(
            'SELECT id, nombre, apellido, email FROM usuarios WHERE id = ? AND activo = TRUE',
            [decoded.id]
          );

          if (usuarios.length > 0) {
            socket.usuario = usuarios[0];
            socket.join(`usuario_${usuarios[0].id}`);
            
            console.log(`👤 Usuario autenticado: ${usuarios[0].email}`);
            
            // Enviar notificaciones pendientes
            await enviarNotificacionesPendientes(socket, usuarios[0].id);
          }
        }
      } catch (error) {
        console.error('Error al autenticar usuario en socket:', error);
      }
    });

    // Unirse a sala de producto para actualizaciones en tiempo real
    socket.on('unirse_producto', (productoId) => {
      socket.join(`producto_${productoId}`);
      console.log(`📦 Cliente se unió a producto: ${productoId}`);
    });

    // Salir de sala de producto
    socket.on('salir_producto', (productoId) => {
      socket.leave(`producto_${productoId}`);
      console.log(`📦 Cliente salió de producto: ${productoId}`);
    });

    // Actualización de carrito en tiempo real
    socket.on('actualizar_carrito', (datos) => {
      if (socket.usuario) {
        socket.to(`usuario_${socket.usuario.id}`).emit('carrito_actualizado', datos);
      }
    });

    // Marcar notificación como leída
    socket.on('marcar_notificacion_leida', async (notificacionId) => {
      try {
        if (socket.usuario) {
          await pool.execute(
            'UPDATE notificaciones SET leida = TRUE WHERE id = ? AND usuario_id = ?',
            [notificacionId, socket.usuario.id]
          );
          
          socket.emit('notificacion_marcada', { id: notificacionId });
        }
      } catch (error) {
        console.error('Error al marcar notificación como leída:', error);
      }
    });

    // Obtener notificaciones no leídas
    socket.on('obtener_notificaciones', async () => {
      try {
        if (socket.usuario) {
          const [notificaciones] = await pool.execute(
            `SELECT id, tipo, titulo, mensaje, leida, datos_extra, fecha_creacion
             FROM notificaciones 
             WHERE usuario_id = ? 
             ORDER BY fecha_creacion DESC 
             LIMIT 20`,
            [socket.usuario.id]
          );

          socket.emit('notificaciones', notificaciones);
        }
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`);
    });
  });
};

// Enviar notificaciones pendientes al usuario
const enviarNotificacionesPendientes = async (socket, usuarioId) => {
  try {
    const [notificaciones] = await pool.execute(
      `SELECT id, tipo, titulo, mensaje, leida, datos_extra, fecha_creacion
       FROM notificaciones 
       WHERE usuario_id = ? AND leida = FALSE
       ORDER BY fecha_creacion DESC`,
      [usuarioId]
    );

    if (notificaciones.length > 0) {
      socket.emit('notificaciones_pendientes', notificaciones);
    }
  } catch (error) {
    console.error('Error al enviar notificaciones pendientes:', error);
  }
};

// Funciones para enviar notificaciones específicas
const notificaciones = {
  // Notificar cambio de estado de pedido
  async notificarEstadoPedido(io, usuarioId, pedidoId, nuevoEstado) {
    try {
      const mensajes = {
        confirmado: 'Tu pedido ha sido confirmado y está siendo procesado',
        procesando: 'Tu pedido está siendo preparado para envío',
        enviado: 'Tu pedido ha sido enviado y está en camino',
        entregado: 'Tu pedido ha sido entregado exitosamente',
        cancelado: 'Tu pedido ha sido cancelado'
      };

      const mensaje = mensajes[nuevoEstado] || 'El estado de tu pedido ha cambiado';

      // Insertar notificación en la base de datos
      await pool.execute(
        `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, datos_extra)
         VALUES (?, 'pedido', ?, ?, ?)`,
        [
          usuarioId,
          `Pedido #${pedidoId}`,
          mensaje,
          JSON.stringify({ pedido_id: pedidoId, estado: nuevoEstado })
        ]
      );

      // Enviar notificación en tiempo real
      io.to(`usuario_${usuarioId}`).emit('nueva_notificacion', {
        tipo: 'pedido',
        titulo: `Pedido #${pedidoId}`,
        mensaje,
        datos_extra: { pedido_id: pedidoId, estado: nuevoEstado }
      });

    } catch (error) {
      console.error('Error al notificar estado de pedido:', error);
    }
  },

  // Notificar producto con bajo stock
  async notificarBajoStock(io, productoId, stock) {
    try {
      // Obtener administradores
      const [admins] = await pool.execute(
        'SELECT id FROM usuarios WHERE rol = "admin" AND activo = TRUE'
      );

      for (const admin of admins) {
        await pool.execute(
          `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, datos_extra)
           VALUES (?, 'producto', ?, ?, ?)`,
          [
            admin.id,
            'Stock Bajo',
            `El producto ID ${productoId} tiene stock bajo (${stock} unidades)`,
            JSON.stringify({ producto_id: productoId, stock })
          ]
        );

        io.to(`usuario_${admin.id}`).emit('nueva_notificacion', {
          tipo: 'producto',
          titulo: 'Stock Bajo',
          mensaje: `El producto ID ${productoId} tiene stock bajo (${stock} unidades)`,
          datos_extra: { producto_id: productoId, stock }
        });
      }

    } catch (error) {
      console.error('Error al notificar bajo stock:', error);
    }
  },

  // Notificar nueva promoción
  async notificarPromocion(io, titulo, mensaje, datosExtra = {}) {
    try {
      // Obtener todos los usuarios activos
      const [usuarios] = await pool.execute(
        'SELECT id FROM usuarios WHERE activo = TRUE'
      );

      for (const usuario of usuarios) {
        await pool.execute(
          `INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, datos_extra)
           VALUES (?, 'promocion', ?, ?, ?)`,
          [usuario.id, titulo, mensaje, JSON.stringify(datosExtra)]
        );

        io.to(`usuario_${usuario.id}`).emit('nueva_notificacion', {
          tipo: 'promocion',
          titulo,
          mensaje,
          datos_extra: datosExtra
        });
      }

    } catch (error) {
      console.error('Error al notificar promoción:', error);
    }
  }
};

module.exports = {
  manejarConexiones,
  notificaciones
};