const Order = require('../models/Order');
const Product = require('../models/Product');

class OrderController {
    static async create(req, res) {
        try {
            const userId = req.userId;
            const { items, total, delivery, paymentMethod } = req.body;

            // Validações
            if (!items || items.length === 0) {
                return res.status(400).json({ message: 'Pedido deve conter itens' });
            }

            if (total < 100) {
                return res.status(400).json({ message: 'Valor mínimo de entrega é R$ 100,00' });
            }

            if (!delivery || !delivery.address || !delivery.neighborhood || !delivery.cep) {
                return res.status(400).json({ message: 'Dados de entrega incompletos' });
            }

            if (!['dinheiro', 'cartao', 'pix'].includes(paymentMethod)) {
                return res.status(400).json({ message: 'Método de pagamento inválido' });
            }

            // Verificar estoque dos produtos
            for (const item of items) {
                const product = await Product.findById(item.id);
                if (!product || product.stock < item.quantity) {
                    return res.status(400).json({ 
                        message: `Produto ${item.name} não possui estoque suficiente` 
                    });
                }
            }

            // Criar pedido
            const order = await Order.create(userId, {
                items,
                total,
                delivery,
                paymentMethod
            });

            // Diminuir estoque
            for (const item of items) {
                await Product.decreaseStock(item.id, item.quantity);
            }

            res.status(201).json({
                message: 'Pedido criado com sucesso',
                order
            });
        } catch (error) {
            console.error('Erro ao criar pedido:', error);
            res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const userId = req.userId;
            const orders = await Order.findByUserId(userId);

            res.json({
                count: orders.length,
                orders
            });
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
            res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }

            // Verificar se o pedido pertence ao usuário
            if (order.user_id !== userId) {
                return res.status(403).json({ message: 'Accesso negado' });
            }

            res.json({ order });
        } catch (error) {
            console.error('Erro ao buscar pedido:', error);
            res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
        }
    }

    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['pendente', 'confirmado', 'a-caminho', 'entregue', 'cancelado'].includes(status)) {
                return res.status(400).json({ message: 'Status inválido' });
            }

            const order = await Order.updateStatus(id, status);

            res.json({
                message: 'Pedido atualizado com sucesso',
                order
            });
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            res.status(500).json({ message: 'Erro ao atualizar pedido', error: error.message });
        }
    }

    static async cancel(req, res) {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const order = await Order.findById(id);
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }

            if (order.user_id !== userId) {
                return res.status(403).json({ message: 'Acesso negado' });
            }

            if (order.status !== 'pendente') {
                return res.status(400).json({ message: 'Apenas pedidos pendentes podem ser cancelados' });
            }

            await Order.delete(id);

            res.json({ message: 'Pedido cancelado com sucesso' });
        } catch (error) {
            console.error('Erro ao cancelar pedido:', error);
            res.status(500).json({ message: 'Erro ao cancelar pedido', error: error.message });
        }
    }
}

module.exports = OrderController;
