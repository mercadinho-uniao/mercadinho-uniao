const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const authMiddleware = require('../middleware/auth');

// Todas as rotas de pagamento requerem autenticação
router.use(authMiddleware);

router.post('/pix', PaymentController.generatePixQRCode);
router.post('/process', PaymentController.createPayment);
router.get('/:orderId', PaymentController.getPaymentByOrder);
router.put('/:paymentId', PaymentController.updatePaymentStatus);

module.exports = router;
