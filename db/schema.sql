-- Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Produtos
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total DECIMAL(10, 2) NOT NULL,
    delivery_address VARCHAR(255),
    delivery_neighborhood VARCHAR(100),
    delivery_cep VARCHAR(10),
    delivery_number VARCHAR(10),
    delivery_complement VARCHAR(255),
    payment_method VARCHAR(20),
    status VARCHAR(50) DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pagamentos
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pendente',
    pix_key VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- Produtos de Exemplo
INSERT INTO products (name, description, category, price, stock) VALUES
('Pão Francês', 'Pão fresco', 'padaria', 0.50, 500),
('Bolo Chocolate', 'Bolo caseiro', 'padaria', 15.00, 50),
('Croissant', 'Masa folhada', 'padaria', 5.00, 100),
('Maçã', 'Maçã fresca', 'quitanda', 2.00, 300),
('Banana', 'Banana', 'quitanda', 1.50, 400),
('Tomate', 'Tomate fresco', 'quitanda', 3.50, 200),
('Alface', 'Alface crespa', 'quitanda', 4.00, 150),
('Acém', 'Carne vermelha', 'acougue', 25.00, 100),
('Filé', 'Filé mignon', 'acougue', 45.00, 50),
('Frango', 'Frango qualidade', 'acougue', 18.00, 80)
ON CONFLICT DO NOTHING;
