const pool = require('../config/database');

class Product {
    static async create(productData) {
        const query = `
            INSERT INTO products (name, description, category, price, stock, image_url, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING id, name, description, category, price, stock, image_url, created_at
        `;
        const result = await pool.query(query, [
            productData.name,
            productData.description,
            productData.category,
            productData.price,
            productData.stock,
            productData.imageUrl
        ]);
        return result.rows[0];
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM products WHERE 1=1';
        const values = [];
        let valueCount = 1;

        if (filters.category) {
            query += ` AND category = $${valueCount}`;
            values.push(filters.category);
            valueCount++;
        }

        if (filters.search) {
            query += ` AND LOWER(name) LIKE LOWER($${valueCount})`;
            values.push(`%${filters.search}%`);
            valueCount++;
        }

        query += ' ORDER BY created_at DESC LIMIT 100';

        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM products WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async update(productId, productData) {
        const query = `
            UPDATE products 
            SET name = $1, description = $2, category = $3, price = $4, stock = $5, updated_at = NOW()
            WHERE id = $6
            RETURNING *
        `;
        const result = await pool.query(query, [
            productData.name,
            productData.description,
            productData.category,
            productData.price,
            productData.stock,
            productId
        ]);
        return result.rows[0];
    }

    static async decreaseStock(productId, quantity) {
        const query = `
            UPDATE products 
            SET stock = stock - $1, updated_at = NOW()
            WHERE id = $2 AND stock >= $1
            RETURNING stock
        `;
        const result = await pool.query(query, [quantity, productId]);
        return result.rows[0];
    }

    static async getCategories() {
        const query = 'SELECT DISTINCT category FROM products ORDER BY category';
        const result = await pool.query(query);
        return result.rows.map(r => r.category);
    }
}

module.exports = Product;
