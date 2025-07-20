const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosDestacados,
  obtenerProductosNuevos,
  obtenerProductosRelacionados,
  buscarProductos
} = require('../controllers/productosController');

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/destacados', obtenerProductosDestacados);
router.get('/nuevos', obtenerProductosNuevos);
router.get('/buscar', buscarProductos);
router.get('/:id', obtenerProductoPorId);
router.get('/:id/relacionados', obtenerProductosRelacionados);

module.exports = router;