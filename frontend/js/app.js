// Main Application Logic

let allProducts = [];
let currentUser = null;

// Elementos do DOM
const productsGrid = document.getElementById('products-grid');
const searchInput = document.getElementById('search-input');
const filterButtons = document.querySelectorAll('.filter-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const addToCartModal = document.getElementById('add-to-cart-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const closeModalButtons = document.querySelectorAll('.close-modal');
const loginLink = document.getElementById('switch-to-login');
const registerLink = document.getElementById('switch-to-register');

let currentFilter = 'all';
let currentSearchTerm = '';
let selectedProduct = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
    checkUserSession();
});

// Carregar produtos do backend
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        
        const data = await response.json();
        allProducts = data.products || data || [];
        
        if (allProducts.length === 0) {
            showMockProducts();
        }
        
        displayProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showMockProducts();
    }
}

// Mostrar produtos fake para demonstração
function showMockProducts() {
    allProducts = [
        { id: 1, name: 'Pão Francês', category: 'padaria', price: 0.50, stock: 100, emoji: '🥖' },
        { id: 2, name: 'Bolo de Chocolate', category: 'padaria', price: 15.00, stock: 20, emoji: '🎂' },
        { id: 3, name: 'Maçã', category: 'quitanda', price: 2.00, stock: 150, emoji: '🍎' },
        { id: 4, name: 'Banana', category: 'quitanda', price: 1.50, stock: 200, emoji: '🍌' },
        { id: 5, name: 'Tomate', category: 'quitanda', price: 3.00, stock: 100, emoji: '🍅' },
        { id: 6, name: 'Acém', category: 'acougue', price: 25.00, stock: 50, emoji: '🥩' },
        { id: 7, name: 'Filé Mignon', category: 'acougue', price: 45.00, stock: 30, emoji: '🥩' },
        { id: 8, name: 'Frango', category: 'acougue', price: 18.00, stock: 80, emoji: '🍗' },
    ];
}

// Exibir produtos
function displayProducts() {
    let filteredProducts = allProducts;

    // Aplicar filtro de categoria
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }

    // Aplicar filtro de busca
    if (currentSearchTerm) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
        );
    }

    // Limpar grid
    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="loading">Nenhum produto encontrado</div>';
        return;
    }

    // Exibir produtos
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Criar card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    // Garantir que o preço seja um número válido antes de formatar
    const priceNum = Number(product.price);
    const priceStr = Number.isFinite(priceNum) ? priceNum.toFixed(2) : '0.00';

    card.innerHTML = `
        <div class="product-image">${product.emoji || '📦'}</div>
        <div class="product-info">
            <div class="product-category">${getCategoryLabel(product.category)}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">R$ ${priceStr}</div>
            <div class="product-stock">
                ${product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
            </div>
            <button class="btn-add-cart" ${product.stock === 0 ? 'disabled' : ''}>
                ${product.stock > 0 ? 'Adicionar' : 'Indisponível'}
            </button>
        </div>
    `;

    if (product.stock > 0) {
        card.querySelector('.btn-add-cart').addEventListener('click', () => {
            openAddToCartModal(product);
        });
    }

    return card;
}

// Abrir modal de adicionar ao carrinho
function openAddToCartModal(product) {
    selectedProduct = product;
    const modalPriceNum = Number(product.price);
    const modalPriceStr = Number.isFinite(modalPriceNum) ? modalPriceNum.toFixed(2) : '0.00';
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-description').textContent = `Categoria: ${getCategoryLabel(product.category)}`;
    document.getElementById('modal-product-price').textContent = modalPriceStr;
    document.getElementById('qty-input').value = 1;
    
    addToCartModal.classList.remove('hidden');
}

// Event listeners do modal de adicionar ao carrinho
document.getElementById('qty-minus')?.addEventListener('click', () => {
    const input = document.getElementById('qty-input');
    if (input.value > 1) input.value--;
});

document.getElementById('qty-plus')?.addEventListener('click', () => {
    const input = document.getElementById('qty-input');
    input.value++;
});

document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
    if (selectedProduct) {
        const quantity = parseInt(document.getElementById('qty-input').value);
        cart.addItem(selectedProduct, quantity);
        addToCartModal.classList.add('hidden');
    }
});

// Setup de event listeners
function setupEventListeners() {
    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            displayProducts();
        });
    });

    // Busca
    searchInput?.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value;
        displayProducts();
    });

    // Close modals
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').classList.add('hidden');
        });
    });

    // Login e Logout
    loginBtn?.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    logoutBtn?.addEventListener('click', async () => {
        await api.logout();
        currentUser = null;
        updateAuthUI();
        location.reload();
    });

    // Forms
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        try {
            const result = await api.login(email, password);
            currentUser = result.user;
            updateAuthUI();
            loginModal.classList.add('hidden');
            showNotification('Login realizado com sucesso!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nome = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const telefone = registerForm.querySelector('input[type="tel"]').value;
        const password = registerForm.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = registerForm.querySelectorAll('input[type="password"]')[1].value;

        if (password !== confirmPassword) {
            showNotification('As senhas não coincidem', 'error');
            return;
        }

        try {
            const result = await api.register({
                name: nome,
                email,
                phone: telefone,
                password
            });
            currentUser = result.user;
            updateAuthUI();
            registerModal.classList.add('hidden');
            showNotification('Conta criada com sucesso!', 'success');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    });

    // Switch entre login e registro
    registerLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.classList.add('hidden');
        registerModal.classList.remove('hidden');
    });

    loginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.classList.add('hidden');
        loginModal.classList.remove('hidden');
    });

    // Fechar modals ao clicar fora
    [loginModal, registerModal, addToCartModal].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// Atualizar UI de autenticação
function updateAuthUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
}

// Verificar sessão do usuário
function checkUserSession() {
    const user = getCurrentUser();
    if (user) {
        currentUser = user;
        updateAuthUI();
    }
}

// Funções auxiliares
function getCategoryLabel(category) {
    const labels = {
        'padaria': '🥖 Padaria',
        'quitanda': '🥬 Quitanda',
        'acougue': '🥩 Açougue'
    };
    return labels[category] || category;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '999';
    notification.style.maxWidth = '300px';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}
