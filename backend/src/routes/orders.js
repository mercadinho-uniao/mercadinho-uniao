const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/OrderController');
const authMiddleware = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// Todas as rotas de pedidos requerem autenticação
router.use(authMiddleware);

router.post('/', validateOrder, OrderController.create);
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.put('/:id', OrderController.updateStatus);
router.delete('/:id', OrderController.cancel);

module.exports = router;
