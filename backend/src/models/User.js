const pool = require('../config/database');

class User {
    static async create(userData) {
        const query = `
            INSERT INTO users (name, email, phone, password_hash, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id, name, email, phone, created_at
        `;
        const result = await pool.query(query, [
            userData.name,
            userData.email,
            userData.phone,
            userData.passwordHash
        ]);
        return result.rows[0];
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, name, email, phone, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async updateProfile(userId, userData) {
        const query = `
            UPDATE users 
            SET name = $1, phone = $2, updated_at = NOW()
            WHERE id = $3
            RETURNING id, name, email, phone, updated_at
        `;
        const result = await pool.query(query, [userData.name, userData.phone, userId]);
        return result.rows[0];
    }
}

module.exports = User;
