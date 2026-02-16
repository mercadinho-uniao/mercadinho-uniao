const { validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');

class UserController {
    static async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, email, phone, password } = req.body;

            // Verificar se usuário já existe
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }

            // Hash da senha
            const passwordHash = await hashPassword(password);

            // Criar usuário
            const user = await User.create({
                name,
                email,
                phone,
                passwordHash
            });

            // Gerar token
            const token = generateToken(user.id, user.email);

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            });
        } catch (error) {
            console.error('Erro no registro:', error);
            res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Buscar usuário
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            // Verificar senha
            const isPasswordValid = await comparePassword(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Email ou senha incorretos' });
            }

            // Gerar token
            const token = generateToken(user.id, user.email);

            res.json({
                message: 'Login realizado com sucesso',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                },
                token
            });
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
        }
    }

    static async getProfile(req, res) {
        try {
            const userId = req.userId;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            res.json({ user });
        } catch (error) {
            console.error('Erro ao buscar perfil:', error);
            res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.userId;
            const { name, phone } = req.body;

            if (!name || !phone) {
                return res.status(400).json({ message: 'Nome e telefone são obrigatórios' });
            }

            const user = await User.updateProfile(userId, { name, phone });

            res.json({
                message: 'Perfil atualizado com sucesso',
                user
            });
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
        }
    }
}

module.exports = UserController;
