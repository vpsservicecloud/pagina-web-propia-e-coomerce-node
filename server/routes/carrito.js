const express = require('express');
const router = express.Router();
const {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  limpiarCarrito
} = require('../controllers/carritoController');
const { usuarioOpcional } = require('../middleware/auth');

// Todas las rutas del carrito permiten usuarios opcionales (invitados)
router.get('/', usuarioOpcional, obtenerCarrito);
router.post('/agregar', usuarioOpcional, agregarProducto);
router.put('/actualizar', usuarioOpcional, actualizarCantidad);
router.delete('/item/:item_id', usuarioOpcional, eliminarProducto);
router.delete('/limpiar', usuarioOpcional, limpiarCarrito);

module.exports = router;