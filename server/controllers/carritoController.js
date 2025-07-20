import { pool } from '../config/database.js';
import { cacheEcommerce } from '../config/redis.js';

// Obtener carrito del usuario
const obtenerCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    // Intentar obtener del cache
    let carrito = await cacheEcommerce.obtenerCarrito(usuarioId, sessionId);

    if (!carrito) {
      // Obtener carrito de la base de datos
      let carritoQuery;
      let carritoParams;

      if (usuarioId) {
        carritoQuery = 'SELECT id FROM carritos WHERE usuario_id = ?';
        carritoParams = [usuarioId];
      } else {
        carritoQuery = 'SELECT id FROM carritos WHERE session_id = ?';
        carritoParams = [sessionId];
      }

      const [carritos] = await pool.execute(carritoQuery, carritoParams);
      
      let carritoId;
      if (carritos.length === 0) {
        // Crear nuevo carrito
        const [resultado] = await pool.execute(
          'INSERT INTO carritos (usuario_id, session_id) VALUES (?, ?)',
          [usuarioId || null, sessionId || null]
        );
        carritoId = resultado.insertId;
      } else {
        carritoId = carritos[0].id;
      }

      // Obtener items del carrito
      const [items] = await pool.execute(`
        SELECT ci.*, p.nombre, p.precio, p.stock, p.imagen_principal,
               (ci.cantidad * ci.precio) as subtotal
        FROM carrito_items ci
        JOIN productos p ON ci.producto_id = p.id
        WHERE ci.carrito_id = ? AND p.activo = TRUE
      `, [carritoId]);

      // Calcular totales
      const subtotal = items.reduce((total, item) => total + parseFloat(item.subtotal), 0);
      const impuestos = subtotal * 0.1; // 10% de impuestos
      const envio = subtotal >= 50 ? 0 : 5.99;
      const total = subtotal + impuestos + envio;

      carrito = {
        id: carritoId,
        items,
        resumen: {
          subtotal: parseFloat(subtotal.toFixed(2)),
          impuestos: parseFloat(impuestos.toFixed(2)),
          envio: parseFloat(envio.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          cantidad_items: items.reduce((total, item) => total + item.cantidad, 0)
        }
      };

      // Guardar en cache
      await cacheEcommerce.establecerCarrito(usuarioId, sessionId, carrito);
    }

    res.json({
      exito: true,
      datos: carrito
    });

  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Agregar producto al carrito
const agregarProducto = async (req, res) => {
  const conexion = await pool.getConnection();
  
  try {
    await conexion.beginTransaction();

    const { producto_id, cantidad = 1 } = req.body;
    const usuarioId = req.usuario?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    // Validar producto
    const [productos] = await conexion.execute(
      'SELECT id, nombre, precio, stock FROM productos WHERE id = ? AND activo = TRUE',
      [producto_id]
    );

    if (productos.length === 0) {
      await conexion.rollback();
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }

    const producto = productos[0];

    // Verificar stock
    if (producto.stock < cantidad) {
      await conexion.rollback();
      return res.status(400).json({
        exito: false,
        mensaje: 'Stock insuficiente'
      });
    }

    // Obtener o crear carrito
    let carritoQuery;
    let carritoParams;

    if (usuarioId) {
      carritoQuery = 'SELECT id FROM carritos WHERE usuario_id = ?';
      carritoParams = [usuarioId];
    } else {
      carritoQuery = 'SELECT id FROM carritos WHERE session_id = ?';
      carritoParams = [sessionId];
    }

    const [carritos] = await conexion.execute(carritoQuery, carritoParams);
    
    let carritoId;
    if (carritos.length === 0) {
      const [resultado] = await conexion.execute(
        'INSERT INTO carritos (usuario_id, session_id) VALUES (?, ?)',
        [usuarioId || null, sessionId || null]
      );
      carritoId = resultado.insertId;
    } else {
      carritoId = carritos[0].id;
    }

    // Verificar si el producto ya está en el carrito
    const [itemsExistentes] = await conexion.execute(
      'SELECT id, cantidad FROM carrito_items WHERE carrito_id = ? AND producto_id = ?',
      [carritoId, producto_id]
    );

    if (itemsExistentes.length > 0) {
      // Actualizar cantidad
      const nuevaCantidad = itemsExistentes[0].cantidad + cantidad;
      
      if (producto.stock < nuevaCantidad) {
        await conexion.rollback();
        return res.status(400).json({
          exito: false,
          mensaje: 'Stock insuficiente para la cantidad solicitada'
        });
      }

      await conexion.execute(
        'UPDATE carrito_items SET cantidad = ? WHERE id = ?',
        [nuevaCantidad, itemsExistentes[0].id]
      );
    } else {
      // Agregar nuevo item
      await conexion.execute(
        'INSERT INTO carrito_items (carrito_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
        [carritoId, producto_id, cantidad, producto.precio]
      );
    }

    await conexion.commit();

    // Limpiar cache del carrito
    await cacheEcommerce.eliminarCarrito(usuarioId, sessionId);

    res.json({
      exito: true,
      mensaje: 'Producto agregado al carrito exitosamente'
    });

  } catch (error) {
    await conexion.rollback();
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  } finally {
    conexion.release();
  }
};

// Actualizar cantidad de producto en carrito
const actualizarCantidad = async (req, res) => {
  const conexion = await pool.getConnection();
  
  try {
    await conexion.beginTransaction();

    const { item_id, cantidad } = req.body;
    const usuarioId = req.usuario?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    if (cantidad <= 0) {
      await conexion.rollback();
      return res.status(400).json({
        exito: false,
        mensaje: 'La cantidad debe ser mayor a 0'
      });
    }

    // Verificar que el item pertenece al carrito del usuario
    let verificarQuery;
    let verificarParams;

    if (usuarioId) {
      verificarQuery = `
        SELECT ci.id, ci.producto_id, p.stock
        FROM carrito_items ci
        JOIN carritos c ON ci.carrito_id = c.id
        JOIN productos p ON ci.producto_id = p.id
        WHERE ci.id = ? AND c.usuario_id = ?
      `;
      verificarParams = [item_id, usuarioId];
    } else {
      verificarQuery = `
        SELECT ci.id, ci.producto_id, p.stock
        FROM carrito_items ci
        JOIN carritos c ON ci.carrito_id = c.id
        JOIN productos p ON ci.producto_id = p.id
        WHERE ci.id = ? AND c.session_id = ?
      `;
      verificarParams = [item_id, sessionId];
    }

    const [items] = await conexion.execute(verificarQuery, verificarParams);

    if (items.length === 0) {
      await conexion.rollback();
      return res.status(404).json({
        exito: false,
        mensaje: 'Item no encontrado en el carrito'
      });
    }

    const item = items[0];

    // Verificar stock
    if (item.stock < cantidad) {
      await conexion.rollback();
      return res.status(400).json({
        exito: false,
        mensaje: 'Stock insuficiente'
      });
    }

    // Actualizar cantidad
    await conexion.execute(
      'UPDATE carrito_items SET cantidad = ? WHERE id = ?',
      [cantidad, item_id]
    );

    await conexion.commit();

    // Limpiar cache del carrito
    await cacheEcommerce.eliminarCarrito(usuarioId, sessionId);

    res.json({
      exito: true,
      mensaje: 'Cantidad actualizada exitosamente'
    });

  } catch (error) {
    await conexion.rollback();
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  } finally {
    conexion.release();
  }
};

// Eliminar producto del carrito
const eliminarProducto = async (req, res) => {
  try {
    const { item_id } = req.params;
    const usuarioId = req.usuario?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    // Verificar que el item pertenece al carrito del usuario
    let verificarQuery;
    let verificarParams;

    if (usuarioId) {
      verificarQuery = `
        SELECT ci.id
        FROM carrito_items ci
        JOIN carritos c ON ci.carrito_id = c.id
        WHERE ci.id = ? AND c.usuario_id = ?
      `;
      verificarParams = [item_id, usuarioId];
    } else {
      verificarQuery = `
        SELECT ci.id
        FROM carrito_items ci
        JOIN carritos c ON ci.carrito_id = c.id
        WHERE ci.id = ? AND c.session_id = ?
      `;
      verificarParams = [item_id, sessionId];
    }

    const [items] = await pool.execute(verificarQuery, verificarParams);

    if (items.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Item no encontrado en el carrito'
      });
    }

    // Eliminar item
    await pool.execute('DELETE FROM carrito_items WHERE id = ?', [item_id]);

    // Limpiar cache del carrito
    await cacheEcommerce.eliminarCarrito(usuarioId, sessionId);

    res.json({
      exito: true,
      mensaje: 'Producto eliminado del carrito exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Limpiar carrito
const limpiarCarrito = async (req, res) => {
  try {
    const usuarioId = req.usuario?.id;
    const sessionId = req.sessionID || req.headers['x-session-id'];

    // Obtener carrito
    let carritoQuery;
    let carritoParams;

    if (usuarioId) {
      carritoQuery = 'SELECT id FROM carritos WHERE usuario_id = ?';
      carritoParams = [usuarioId];
    } else {
      carritoQuery = 'SELECT id FROM carritos WHERE session_id = ?';
      carritoParams = [sessionId];
    }

    const [carritos] = await pool.execute(carritoQuery, carritoParams);

    if (carritos.length > 0) {
      // Eliminar todos los items del carrito
      await pool.execute('DELETE FROM carrito_items WHERE carrito_id = ?', [carritos[0].id]);
    }

    // Limpiar cache del carrito
    await cacheEcommerce.eliminarCarrito(usuarioId, sessionId);

    res.json({
      exito: true,
      mensaje: 'Carrito limpiado exitosamente'
    });

  } catch (error) {
    console.error('Error al limpiar carrito:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

export {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  limpiarCarrito
};