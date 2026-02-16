// Cart Management
const CART_KEY = 'mercadinho_cart';
const MIN_DELIVERY_VALUE = 100;

class Cart {
    constructor() {
        this.items = this.loadCart();
    }

    loadCart() {
        const cartStr = localStorage.getItem(CART_KEY);
        return cartStr ? JSON.parse(cartStr) : [];
    }

    saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(this.items));
        this.updateCartCount();
    }

    addItem(product, quantity) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.showNotification(`${quantity}x ${product.name} adicionado ao carrinho!`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    isEmpty() {
        return this.items.length === 0;
    }

    clear() {
        this.items = [];
        this.saveCart();
    }

    updateCartCount() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            badge.textContent = this.getItemCount();
        }
    }

    showNotification(message) {
        // Criar notificação visual
        const notification = document.createElement('div');
        notification.className = 'alert alert-success';
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.zIndex = '999';
        notification.style.maxWidth = '300px';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 3000);
    }

    canDeliver() {
        return this.getTotal() >= MIN_DELIVERY_VALUE;
    }

    getMissingForDelivery() {
        const missing = MIN_DELIVERY_VALUE - this.getTotal();
        return missing > 0 ? missing : 0;
    }
}

// Instância global do carrinho
const cart = new Cart();

// Atualizar badge do carrinho ao carregar página
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});
