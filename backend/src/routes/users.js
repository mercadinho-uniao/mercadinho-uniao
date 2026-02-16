const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Públicas
router.post('/register', validateRegister, UserController.register);
router.post('/login', validateLogin, UserController.login);

// Protegidas
router.get('/profile', authMiddleware, UserController.getProfile);
router.put('/profile', authMiddleware, UserController.updateProfile);

module.exports = router;
