// API Configuration
// Para desenvolvimento local: 'http://localhost:3000/api'
// Para Render cloud: 'https://mercadinho-uniao-api.onrender.com/api'
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://mercadinho-uniao-api.onrender.com/api';

// Auth Token
let authToken = localStorage.getItem('authToken');

// API Functions
const api = {
    // PRODUTOS
    async getProducts(filters = {}) {
        try {
            const query = new URLSearchParams(filters);
            const response = await fetch(`${API_BASE_URL}/products?${query}`);
            if (!response.ok) throw new Error('Erro ao buscar produtos');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    },

    async getProductById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            if (!response.ok) throw new Error('Produto não encontrado');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return null;
        }
    },

    // USUÁRIOS - Authentication
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                return data;
            }
            throw new Error(data.message || 'Erro ao fazer login');
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (response.ok) {
                authToken = data.token;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                return data;
            }
            throw new Error(data.message || 'Erro ao registrar');
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    async logout() {
        authToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    // PEDIDOS
    async createOrder(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao criar pedido');
            return data;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    async getOrders() {
        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) throw new Error('Erro ao buscar pedidos');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    },

    async getOrderById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            if (!response.ok) throw new Error('Pedido não encontrado');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return null;
        }
    },

    // PAGAMENTOS
    async generatePixQRCode(orderId, amount) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/pix`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ orderId, amount })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao gerar PIX');
            return data;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    async processPayment(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/payments/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(orderData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao processar pagamento');
            return data;
        } catch (error) {
            console.error('Erro:', error);
            throw error;
        }
    },

    // CATEGORIAS
    async getCategories() {
        try {
            const response = await fetch(`${API_BASE_URL}/products/categories`);
            if (!response.ok) throw new Error('Erro ao buscar categorias');
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
            return [];
        }
    }
};

// Função auxiliar para verificar autenticação
function isAuthenticated() {
    return !!authToken;
}

// Função auxiliar para obter usuário armazenado
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
