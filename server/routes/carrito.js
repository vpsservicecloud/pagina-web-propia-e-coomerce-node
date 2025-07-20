import express from 'express';
import {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  limpiarCarrito
} from '../controllers/carritoController.js';
import { usuarioOpcional } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas del carrito permiten usuarios opcionales (invitados)
router.get('/', usuarioOpcional, obtenerCarrito);
router.post('/agregar', usuarioOpcional, agregarProducto);
router.put('/actualizar', usuarioOpcional, actualizarCantidad);
router.delete('/item/:item_id', usuarioOpcional, eliminarProducto);
router.delete('/limpiar', usuarioOpcional, limpiarCarrito);

export default router;