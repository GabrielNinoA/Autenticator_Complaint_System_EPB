const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * POST /auth/login
 * Inicia sesión de un usuario
 * Body: { username, password }
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * POST /auth/logout
 * Cierra sesión de un usuario
 * Body: { username }
 */
router.post('/logout', (req, res) => authController.logout(req, res));

/**
 * GET /auth/verify/:username
 * Verifica si un usuario está logueado
 * Params: username
 */
router.get('/verify/:username', (req, res) => authController.verifyUser(req, res));

module.exports = router;
