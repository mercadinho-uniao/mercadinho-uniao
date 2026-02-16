const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
};

const generateToken = (userId, email) => {
    return jwt.sign(
        { id: userId, email: email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const formatPhone = (phone) => {
    // Remove caracteres não numéricos
    return phone.replace(/\D/g, '');
};

const validateCEP = (cep) => {
    // Formato: XXXXX-XXX
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(cep);
};

const calculateDeliveryFee = (value) => {
    // Entrega grátis para pedidos acima de 100
    if (value >= 100) return 0;
    // Entrega com custo para pedidos entre 50 e 100
    if (value >= 50) return 5.00;
    // Não permite entrega abaixo de 50
    return null;
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    formatPhone,
    validateCEP,
    calculateDeliveryFee
};
