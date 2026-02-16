const { validationResult, body, param } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const validateRegister = [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('email').isEmail().withMessage('Email inválido'),
    body('phone').notEmpty().withMessage('Telefone é obrigatório'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter pelo menos 6 caracteres'),
    handleValidationErrors
];

const validateLogin = [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('Senha é obrigatória'),
    handleValidationErrors
];

const validateProduct = [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('category').notEmpty().withMessage('Categoria é obrigatória'),
    body('price').isFloat({ gt: 0 }).withMessage('Preço deve ser maior que 0'),
    body('stock').isInt({ gte: 0 }).withMessage('Estoque deve ser um número não negativo'),
    handleValidationErrors
];

const validateOrder = [
    body('items').isArray().withMessage('Itens deve ser um array'),
    body('total').isFloat({ gt: 100 }).withMessage('Total deve ser maior que R$ 100'),
    body('delivery').notEmpty().withMessage('Dados de entrega são obrigatórios'),
    body('paymentMethod').isIn(['dinheiro', 'cartao', 'pix']).withMessage('Método de pagamento inválido'),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateProduct,
    validateOrder,
    handleValidationErrors
};
