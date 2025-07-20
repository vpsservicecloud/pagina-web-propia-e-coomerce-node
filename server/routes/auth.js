import express from 'express';
import {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword
} from '../controllers/authController.js';
import { verificarAuth } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);

// Rutas protegidas
router.post('/logout', verificarAuth, cerrarSesion);
router.get('/perfil', verificarAuth, obtenerPerfil);
router.put('/perfil', verificarAuth, actualizarPerfil);
router.put('/cambiar-password', verificarAuth, cambiarPassword);

export default router;