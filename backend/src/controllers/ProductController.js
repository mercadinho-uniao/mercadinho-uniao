const Product = require('../models/Product');

class ProductController {
    static async create(req, res) {
        try {
            const { name, description, category, price, stock, imageUrl } = req.body;

            if (!name || !category || !price || stock === undefined) {
                return res.status(400).json({ message: 'Campos obrigatórios não fornecidos' });
            }

            const product = await Product.create({
                name,
                description,
                category,
                price,
                stock,
                imageUrl
            });

            res.status(201).json({
                message: 'Produto criado com sucesso',
                product
            });
        } catch (error) {
            console.error('Erro ao criar produto:', error);
            res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const { category, search } = req.query;

            const products = await Product.findAll({ category, search });

            res.json({
                count: products.length,
                products
            });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            res.json({ product });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, category, price, stock } = req.body;

            if (!name || !category || !price || stock === undefined) {
                return res.status(400).json({ message: 'Campos obrigatórios não fornecidos' });
            }

            const product = await Product.update(id, {
                name,
                description,
                category,
                price,
                stock
            });

            if (!product) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }

            res.json({
                message: 'Produto atualizado com sucesso',
                product
            });
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
        }
    }

    static async getCategories(req, res) {
        try {
            const categories = await Product.getCategories();

            res.json({
                categories
            });
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            res.status(500).json({ message: 'Erro ao buscar categorias', error: error.message });
        }
    }
}

module.exports = ProductController;
