const Payment = require('../models/Payment');
const Order = require('../models/Order');

class PaymentController {
    static async generatePixQRCode(req, res) {
        try {
            const { orderId, amount } = req.body;

            if (!orderId || !amount) {
                return res.status(400).json({ message: 'orderId e amount são obrigatórios' });
            }

            // Verificar se pedido existe
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }

            // Criar transação PIX
            const payment = await Payment.createPixTransaction(orderId, amount);

            // Em produção, aqui viria a geração real do QR Code via API do PIX
            // Para agora, retornamos dados simulados
            const pixData = {
                qrCode: `00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000520400005303986540${amount.toString().padStart(10, '0')}5802BR5913MERCADINHO6009SAO PAULO62410503***63041A3A`,
                copyAndPaste: `00020126580014br.gov.bcb.pix...`,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
            };

            res.json({
                message: 'QR Code PIX gerado com sucesso',
                payment: {
                    id: payment.id,
                    orderId: payment.order_id,
                    amount: payment.amount,
                    status: payment.status
                },
                pixData
            });
        } catch (error) {
            console.error('Erro ao gerar PIX:', error);
            res.status(500).json({ message: 'Erro ao gerar PIX', error: error.message });
        }
    }

    static async createPayment(req, res) {
        try {
            const { orderId, amount, method, cardData } = req.body;

            if (!orderId || !amount || !method) {
                return res.status(400).json({ message: 'Dados de pagamento incompletos' });
            }

            // Validação do método de pagamento
            if (!['dinheiro', 'cartao', 'pix'].includes(method)) {
                return res.status(400).json({ message: 'Método de pagamento inválido' });
            }

            // Validações específicas do cartão
            if (method === 'cartao' && !cardData) {
                return res.status(400).json({ message: 'Dados do cartão são obrigatórios' });
            }

            // Buscar pedido
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: 'Pedido não encontrado' });
            }

            // Criar pagamento
            const payment = await Payment.createPayment({
                orderId,
                amount,
                method,
                status: 'processando'
            });

            // Em produção, aqui seria feita a integração com gateway de pagamento
            // Por agora, simulamos sucesso
            const updatedPayment = await Payment.updatePaymentStatus(payment.id, 'aprovado');
            
            // Atualizar status do pedido
            await Order.updateStatus(orderId, 'confirmado');

            res.json({
                message: 'Pagamento processado com sucesso',
                payment: updatedPayment
            });
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            res.status(500).json({ message: 'Erro ao processar pagamento', error: error.message });
        }
    }

    static async getPaymentByOrder(req, res) {
        try {
            const { orderId } = req.params;

            const payment = await Payment.getPaymentByOrderId(orderId);
            if (!payment) {
                return res.status(404).json({ message: 'Pagamento não encontrado' });
            }

            res.json({ payment });
        } catch (error) {
            console.error('Erro ao buscar pagamento:', error);
            res.status(500).json({ message: 'Erro ao buscar pagamento', error: error.message });
        }
    }

    static async updatePaymentStatus(req, res) {
        try {
            const { paymentId } = req.params;
            const { status } = req.body;

            if (!['pendente', 'processando', 'aprovado', 'recusado', 'reembolsado'].includes(status)) {
                return res.status(400).json({ message: 'Status de pagamento inválido' });
            }

            const payment = await Payment.updatePaymentStatus(paymentId, status);

            res.json({
                message: 'Status do pagamento atualizado',
                payment
            });
        } catch (error) {
            console.error('Erro ao atualizar pagamento:', error);
            res.status(500).json({ message: 'Erro ao atualizar pagamento', error: error.message });
        }
    }
}

module.exports = PaymentController;
