import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductosDestacados,
  obtenerProductosNuevos,
  obtenerProductosRelacionados,
  buscarProductos
} from '../controllers/productosController.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/destacados', obtenerProductosDestacados);
router.get('/nuevos', obtenerProductosNuevos);
router.get('/buscar', buscarProductos);
router.get('/:id', obtenerProductoPorId);
router.get('/:id/relacionados', obtenerProductosRelacionados);

export default router;