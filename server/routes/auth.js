const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword
} = require('../controllers/authController');
const { verificarAuth } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);

// Rutas protegidas
router.post('/logout', verificarAuth, cerrarSesion);
router.get('/perfil', verificarAuth, obtenerPerfil);
router.put('/perfil', verificarAuth, actualizarPerfil);
router.put('/cambiar-password', verificarAuth, cambiarPassword);

module.exports = router;