const pool = require('../config/database');

class Order {
    static async create(userId, orderData) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Criar pedido
            const orderQuery = `
                INSERT INTO orders (user_id, total, delivery_address, delivery_neighborhood, delivery_cep, delivery_number, delivery_complement, payment_method, status, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pendente', NOW())
                RETURNING id, user_id, total, payment_method, status, created_at
            `;
            const orderResult = await client.query(orderQuery, [
                userId,
                orderData.total,
                orderData.delivery.address,
                orderData.delivery.neighborhood,
                orderData.delivery.cep,
                orderData.delivery.number,
                orderData.delivery.complement,
                orderData.paymentMethod
            ]);

            const orderId = orderResult.rows[0].id;

            // Adicionar itens do pedido
            for (const item of orderData.items) {
                const itemQuery = `
                    INSERT INTO order_items (order_id, product_id, quantity, price_per_unit)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(itemQuery, [
                    orderId,
                    item.id,
                    item.quantity,
                    item.price
                ]);
            }

            await client.query('COMMIT');
            return await Order.findById(orderId);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async findById(orderId) {
        const query = `
            SELECT o.*, json_agg(json_build_object(
                'id', p.id,
                'name', p.name,
                'quantity', oi.quantity,
                'price', oi.price_per_unit
            )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.id = $1
            GROUP BY o.id
        `;
        const result = await pool.query(query, [orderId]);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const query = `
            SELECT o.*, json_agg(json_build_object(
                'id', p.id,
                'name', p.name,
                'quantity', oi.quantity,
                'price', oi.price_per_unit
            )) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }

    static async updateStatus(orderId, status) {
        const query = `
            UPDATE orders 
            SET status = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [status, orderId]);
        return result.rows[0];
    }

    static async delete(orderId) {
        const query = 'DELETE FROM orders WHERE id = $1';
        await pool.query(query, [orderId]);
    }
}

module.exports = Order;
