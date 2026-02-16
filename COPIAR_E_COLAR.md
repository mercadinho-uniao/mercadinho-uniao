# 📋 COPIAR E COLAR - Tudo Pronto

## Use este arquivo para copiar/colar exatamente!

---

## 1️⃣ CRIAR BANCO - SQL (COPIE E COLE INTEIRO)

```sql
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
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Produtos de Exemplo
INSERT INTO products (name, description, category, price, stock) VALUES
('Pão Francês', 'Pão fresco do dia', 'padaria', 0.50, 500),
('Bolo de Chocolate', 'Bolo caseiro delicioso', 'padaria', 15.00, 50),
('Croissant', 'Massa folhada francesa', 'padaria', 5.00, 100),
('Maçã Vermelha', 'Frutas frescas importadas', 'quitanda', 2.00, 300),
('Banana Prata', 'Frutas da região', 'quitanda', 1.50, 400),
('Tomate Caqui', 'Tomate fresco e suculento', 'quitanda', 3.50, 200),
('Alface Crespa', 'Verdura fresca do dia', 'quitanda', 4.00, 150),
('Acém', 'Carne vermelha premium', 'acougue', 25.00, 100),
('Filé Mignon', 'Carne nobre de primeira', 'acougue', 45.00, 50),
('Frango Inteiro', 'Frango de qualidade garantida', 'acougue', 18.00, 80);
```

---

## 2️⃣ COMANDOS GIT (COPIE UM POR UM)

### Inicializar Git (primeira vez)
```bash
git init
git add .
git commit -m "Initial commit - Mercadinho União"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mercadinho-uniao.git
git push -u origin main
```

### Fazer mudanças depois
```bash
git add .
git commit -m "Descrição da mudança"
git push origin main
```

---

## 3️⃣ VARIÁVEIS DE AMBIENTE - RENDER

Copie e preencha com seus valores:

```
DB_HOST = seu-postgres-xxxxx.c.aivencloud.com
DB_PORT = 5432
DB_USER = admin
DB_PASSWORD = SUA_SENHA_AQUI_DO_RENDER
DB_NAME = mercadinho_db
PORT = 3000
NODE_ENV = production
JWT_SECRET = mercadinho-secret-key-123456789
CORS_ORIGIN = https://seu-site.netlify.app
```

---

## 4️⃣ TESTAR API COM CURL

### Health Check
```bash
curl https://mercadinho-uniao-api.onrender.com/health
```

Esperado:
```json
{"status":"OK","message":"Servidor rodando"}
```

### Registrar Usuário
```bash
curl -X POST https://mercadinho-uniao-api.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Teste","email":"joao@teste.com","phone":"11999999999","password":"teste123"}'
```

### Login
```bash
curl -X POST https://mercadinho-uniao-api.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@teste.com","password":"teste123"}'
```

**Copie o token retornado!**

### Listar Produtos
```bash
curl https://mercadinho-uniao-api.onrender.com/api/products
```

### Criar Pedido (IMPORTANTE: mude TOKEN)
```bash
curl -X POST https://mercadinho-uniao-api.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer COLE_O_TOKEN_AQUI" \
  -d '{
    "items": [{"id":1,"name":"Pão","price":0.50,"quantity":200}],
    "total":100,
    "delivery": {"address":"Rua A","neighborhood":"Centro","cep":"01310100","number":"123"},
    "paymentMethod": "dinheiro"
  }'
```

---

## 5️⃣ ATUALIZAR API.JS PARA CLOUD

Abra: `frontend/js/api.js`

Mude a primeira linha de:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Para:
```javascript
const API_BASE_URL = 'https://mercadinho-uniao-api.onrender.com/api';
```

Salve, commit e push!

---

## 6️⃣ URLS FINAIS PARA TESTAR

Substitua "seu-site" pela URL real do Netlify:

```
FRONTEND:  https://seu-site.netlify.app
BACKEND:   https://mercadinho-uniao-api.onrender.com
HEALTH:    https://mercadinho-uniao-api.onrender.com/health
PRODUCTS:  https://mercadinho-uniao-api.onrender.com/api/products
```

---

## 7️⃣ DADOS DE TESTE

```
Email:    teste@teste.com
Senha:    teste123
Nome:     Teste Silva
Telefone: 11999999999
```

---

## 8️⃣ NETLIFY BUILD SETTINGS

Base directory: `frontend`
Build command: (deixar vazio)
Publish directory: `frontend`

---

## 9️⃣ RENDER BACKEND SETTINGS

Build Command:
```
cd backend && npm install
```

Start Command:
```
cd backend && npm start
```

---

## 🔟 RENDERIZAR DATABASE NO RENDER

```
Clique em "New +" → PostgreSQL
Name: mercadinho-db
Database: mercadinho_db
User: admin
Region: São Paulo (ou próxima)
```

---

## ✅ CHECKLIST FINAL

- [ ] PostgreSQL criado (Render)
- [ ] SQL executado (Render Browser)
- [ ] GitHub repo criado
- [ ] Código push ao GitHub
- [ ] Backend deployado (Render)
- [ ] Frontend deployado (Netlify)
- [ ] API_BASE_URL atualizado
- [ ] Health check funciona
- [ ] Consegue registrar
- [ ] Consegue fazer pedido

---

**Uso:**
1. Copie o código/comando que precisa
2. Cole onde precisa
3. Altere valores em maiúsculas (SEUS_DADOS)
4. Execute

Tudo pronto para copiar e colar! 🎯
