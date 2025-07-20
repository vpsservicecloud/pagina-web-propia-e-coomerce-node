const { pool } = require('../config/database');
const { cacheEcommerce } = require('../config/redis');

// Obtener todos los productos con filtros
const obtenerProductos = async (req, res) => {
  try {
    const {
      categoria,
      busqueda,
      precio_min,
      precio_max,
      ordenar = 'fecha_creacion',
      direccion = 'DESC',
      pagina = 1,
      limite = 12
    } = req.query;

    // Crear clave de cache
    const filtros = { categoria, busqueda, precio_min, precio_max, ordenar, direccion, pagina, limite };
    
    // Intentar obtener del cache
    let productos = await cacheEcommerce.obtenerProductos(filtros);
    
    if (!productos) {
      // Construir consulta SQL
      let consulta = `
        SELECT p.*, c.nombre as categoria_nombre,
               (SELECT url FROM producto_imagenes WHERE producto_id = p.id ORDER BY orden LIMIT 1) as imagen_principal
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = TRUE
      `;
      
      let parametros = [];

      // Filtro por categoría
      if (categoria) {
        consulta += ' AND c.nombre = ?';
        parametros.push(categoria);
      }

      // Filtro por búsqueda
      if (busqueda) {
        consulta += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
        parametros.push(`%${busqueda}%`, `%${busqueda}%`);
      }

      // Filtro por precio
      if (precio_min) {
        consulta += ' AND p.precio >= ?';
        parametros.push(parseFloat(precio_min));
      }

      if (precio_max) {
        consulta += ' AND p.precio <= ?';
        parametros.push(parseFloat(precio_max));
      }

      // Ordenamiento
      const ordenamientosValidos = ['nombre', 'precio', 'fecha_creacion'];
      const direccionesValidas = ['ASC', 'DESC'];
      
      if (ordenamientosValidos.includes(ordenar) && direccionesValidas.includes(direccion.toUpperCase())) {
        consulta += ` ORDER BY p.${ordenar} ${direccion.toUpperCase()}`;
      }

      // Paginación
      const offset = (parseInt(pagina) - 1) * parseInt(limite);
      consulta += ' LIMIT ? OFFSET ?';
      parametros.push(parseInt(limite), offset);

      // Ejecutar consulta
      const [resultados] = await pool.execute(consulta, parametros);

      // Obtener total de productos para paginación
      let consultaTotal = `
        SELECT COUNT(*) as total
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = TRUE
      `;
      
      let parametrosTotal = [];

      if (categoria) {
        consultaTotal += ' AND c.nombre = ?';
        parametrosTotal.push(categoria);
      }

      if (busqueda) {
        consultaTotal += ' AND (p.nombre LIKE ? OR p.descripcion LIKE ?)';
        parametrosTotal.push(`%${busqueda}%`, `%${busqueda}%`);
      }

      if (precio_min) {
        consultaTotal += ' AND p.precio >= ?';
        parametrosTotal.push(parseFloat(precio_min));
      }

      if (precio_max) {
        consultaTotal += ' AND p.precio <= ?';
        parametrosTotal.push(parseFloat(precio_max));
      }

      const [totalResultados] = await pool.execute(consultaTotal, parametrosTotal);
      const total = totalResultados[0].total;

      productos = {
        productos: resultados,
        paginacion: {
          pagina_actual: parseInt(pagina),
          total_paginas: Math.ceil(total / parseInt(limite)),
          total_productos: total,
          productos_por_pagina: parseInt(limite)
        }
      };

      // Guardar en cache
      await cacheEcommerce.establecerProductos(filtros, productos);
    }

    res.json({
      exito: true,
      datos: productos
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener producto por ID
const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Intentar obtener del cache
    let producto = await cacheEcommerce.obtenerProducto(id);

    if (!producto) {
      // Obtener producto de la base de datos
      const [productos] = await pool.execute(`
        SELECT p.*, c.nombre as categoria_nombre
        FROM productos p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.id = ? AND p.activo = TRUE
      `, [id]);

      if (productos.length === 0) {
        return res.status(404).json({
          exito: false,
          mensaje: 'Producto no encontrado'
        });
      }

      producto = productos[0];

      // Obtener imágenes del producto
      const [imagenes] = await pool.execute(`
        SELECT url, alt_text, orden
        FROM producto_imagenes
        WHERE producto_id = ?
        ORDER BY orden
      `, [id]);

      // Obtener especificaciones del producto
      const [especificaciones] = await pool.execute(`
        SELECT nombre, valor
        FROM producto_especificaciones
        WHERE producto_id = ?
      `, [id]);

      // Agregar imágenes y especificaciones al producto
      producto.imagenes = imagenes;
      producto.especificaciones = especificaciones.reduce((acc, spec) => {
        acc[spec.nombre] = spec.valor;
        return acc;
      }, {});

      // Guardar en cache
      await cacheEcommerce.establecerProducto(id, producto);
    }

    // Incrementar contador de vistas
    await cacheEcommerce.incrementarVistaProducto(id);

    res.json({
      exito: true,
      datos: producto
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener productos destacados
const obtenerProductosDestacados = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 8;

    const [productos] = await pool.execute(`
      SELECT p.*, c.nombre as categoria_nombre,
             (SELECT url FROM producto_imagenes WHERE producto_id = p.id ORDER BY orden LIMIT 1) as imagen_principal
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = TRUE AND p.destacado = TRUE
      ORDER BY p.fecha_creacion DESC
      LIMIT ?
    `, [limite]);

    res.json({
      exito: true,
      datos: productos
    });

  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener productos nuevos
const obtenerProductosNuevos = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 8;

    const [productos] = await pool.execute(`
      SELECT p.*, c.nombre as categoria_nombre,
             (SELECT url FROM producto_imagenes WHERE producto_id = p.id ORDER BY orden LIMIT 1) as imagen_principal
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = TRUE AND p.nuevo = TRUE
      ORDER BY p.fecha_creacion DESC
      LIMIT ?
    `, [limite]);

    res.json({
      exito: true,
      datos: productos
    });

  } catch (error) {
    console.error('Error al obtener productos nuevos:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener productos relacionados
const obtenerProductosRelacionados = async (req, res) => {
  try {
    const { id } = req.params;
    const limite = parseInt(req.query.limite) || 4;

    // Obtener categoría del producto actual
    const [productoActual] = await pool.execute(
      'SELECT categoria_id FROM productos WHERE id = ?',
      [id]
    );

    if (productoActual.length === 0) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Producto no encontrado'
      });
    }

    // Obtener productos relacionados de la misma categoría
    const [productos] = await pool.execute(`
      SELECT p.*, c.nombre as categoria_nombre,
             (SELECT url FROM producto_imagenes WHERE producto_id = p.id ORDER BY orden LIMIT 1) as imagen_principal
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = TRUE 
        AND p.categoria_id = ? 
        AND p.id != ?
      ORDER BY RAND()
      LIMIT ?
    `, [productoActual[0].categoria_id, id, limite]);

    res.json({
      exito: true,
      datos: productos
    });

  } catch (error) {
    console.error('Error al obtener productos relacionados:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

// Buscar productos
const buscarProductos = async (req, res) => {
  try {
    const { q: termino } = req.query;

    if (!termino || termino.trim().length < 2) {
      return res.status(400).json({
        exito: false,
        mensaje: 'El término de búsqueda debe tener al menos 2 caracteres'
      });
    }

    const [productos] = await pool.execute(`
      SELECT p.*, c.nombre as categoria_nombre,
             (SELECT url FROM producto_imagenes WHERE producto_id = p.id ORDER BY orden LIMIT 1) as imagen_principal,
             MATCH(p.nombre, p.descripcion) AGAINST(? IN NATURAL LANGUAGE MODE) as relevancia
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.activo = TRUE 
        AND (MATCH(p.nombre, p.descripcion) AGAINST(? IN NATURAL LANGUAGE MODE)
             OR p.nombre LIKE ? 
             OR p.descripcion LIKE ?)
      ORDER BY relevancia DESC, p.nombre ASC
      LIMIT 50
    `, [termino, termino, `%${termino}%`, `%${termino}%`]);

    res.json({
      exito: true,
      datos: {
        productos,
        termino_busqueda: termino,
        total_resultados: productos.length
      }
    });

  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosDestacados,
  obtenerProductosNuevos,
  obtenerProductosRelacionados,
  buscarProductos
};