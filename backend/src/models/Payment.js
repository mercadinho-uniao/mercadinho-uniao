const pool = require('../config/database');

class Payment {
    static async createPixTransaction(orderId, amount) {
        const query = `
            INSERT INTO payments (order_id, amount, method, status, pix_key, created_at)
            VALUES ($1, $2, $3, 'pendente', $4, NOW())
            RETURNING id, order_id, amount, method, status, pix_key
        `;
        
        // Gerar chave PIX única (em produção seria via API)
        const pixKey = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const result = await pool.query(query, [orderId, amount, 'pix', pixKey]);
        return result.rows[0];
    }

    static async createPayment(paymentData) {
        const query = `
            INSERT INTO payments (order_id, amount, method, status, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id, order_id, amount, method, status
        `;
        const result = await pool.query(query, [
            paymentData.orderId,
            paymentData.amount,
            paymentData.method,
            paymentData.status || 'pendente'
        ]);
        return result.rows[0];
    }

    static async updatePaymentStatus(paymentId, status) {
        const query = `
            UPDATE payments 
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [status, paymentId]);
        return result.rows[0];
    }

    static async getPaymentByOrderId(orderId) {
        const query = 'SELECT * FROM payments WHERE order_id = $1 ORDER BY created_at DESC LIMIT 1';
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    }
}

module.exports = Payment;
