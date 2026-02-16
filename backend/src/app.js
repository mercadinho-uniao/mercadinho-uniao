require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

// Importar rotas
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware
// CORS configuration: support comma-separated origins or '*'.
const rawOrigins = process.env.CORS_ORIGIN || '*';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);

if (allowedOrigins.includes('*')) {
    // Allow any origin (useful for quick testing). In production, prefer explicit origins.
    app.use(cors({ origin: true, credentials: true }));
} else {
    app.use(cors({
        origin: function (origin, callback) {
            // Allow non-browser requests (e.g. curl, server-to-server) when origin is undefined
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('CORS policy: Origin not allowed'));
            }
        },
        credentials: true
    }));
}

// Ensure OPTIONS preflight requests are handled
app.options('*', cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor rodando' });
});

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Erro 404
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
});

module.exports = app;
