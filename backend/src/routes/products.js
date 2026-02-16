const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const { validateProduct } = require('../middleware/validation');

// Públicas
router.get('/', ProductController.getAll);
router.get('/categories', ProductController.getCategories);
router.get('/:id', ProductController.getById);

// Protegidas (admin)
router.post('/', validateProduct, ProductController.create);
router.put('/:id', validateProduct, ProductController.update);

module.exports = router;
