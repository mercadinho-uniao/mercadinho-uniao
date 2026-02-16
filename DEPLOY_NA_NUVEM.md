# 🚀 DEPLOY 100% CLOUD - Passo a Passo

## ⚡ Resumo: Você vai fazer em 30 minutos

1. ✅ Criar banco PostgreSQL (Render) - 5 min
2. ✅ Executar SQL (Render browser) - 2 min
3. ✅ Criar repositório GitHub - 2 min
4. ✅ Push do projeto - 3 min
5. ✅ Deploy Backend (Render) - 8 min
6. ✅ Deploy Frontend (Netlify) - 5 min
7. ✅ Testar tudo - 5 min

---

## PASSO 1: BANCO DE DADOS (5 min)

### 1.1 Abrir Render
- Vá para **[render.com](https://render.com)**
- Clique em **"Sign up"** (ou faça login se tiver conta)
- Use email ou GitHub

### 1.2 Criar PostgreSQL
- Clique em **"New +"** (canto superior direito)
- Selecione **"PostgreSQL"**
- Preencha:
  - **Name**: `mercadinho-db`
  - **Database**: `mercadinho_db`
  - **User**: `admin`
  - (Deixe password ser gerada)
  - **Region**: São Paulo (se disponível) ou similar
- Clique **"Create Database"**

### 1.3 Aguardar
- Render vai criar (~2 minutos)
- Quando ficar verde = está pronto!

### 1.4 Pegar Connection String
- Na página do banco, copie:
  - **Host** (pode ser interno ou externo)
  - **Port**
  - **User**
  - **Password**
  - **Database**

Vai parecer assim:
```
postgresql://admin:senha123@postgres-xxxxx.c.aivencloud.com:5432/mercadinho_db
```

---

## PASSO 2: EXECUTAR SQL (2 min)

### 2.1 Browser do Render
- Na página do seu banco PostgreSQL
- Clique na aba **"Browser"**
- Você verá um editor de SQL

### 2.2 Copiar SQL Completo
- Copie TODO este SQL e cole no Render:

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
('Pão Francês', 'Pão fresco', 'padaria', 0.50, 500),
('Bolo Chocolate', 'Bolo caseiro', 'padaria', 15.00, 50),
('Croissant', 'Masa folhada', 'padaria', 5.00, 100),
('Maçã', 'Maçã fresca', 'quitanda', 2.00, 300),
('Banana', 'Banana', 'quitanda', 1.50, 400),
('Tomate', 'Tomate fresco', 'quitanda', 3.50, 200),
('Alface', 'Alface crespa', 'quitanda', 4.00, 150),
('Acém', 'Carne vermelha', 'acougue', 25.00, 100),
('Filé', 'Filé mignon', 'acougue', 45.00, 50),
('Frango', 'Frango qualidade', 'acougue', 18.00, 80);
```

### 2.3 Rodar SQL
- Clique em **"Run"** ou **Execute**
- Deve aparecer: ✅ Tabelas criadas com sucesso

✅ Banco pronto!

---

## PASSO 3: REPOSITÓRIO GITHUB (2 min)

### 3.1 Criar conta GitHub
- Se não tiver: **[github.com](https://github.com)**
- Faça sign up gratuito

### 3.2 Novo Repositório
- Clique **"+"** (canto superior)
- **"New repository"**
- Preencha:
  - **Repository name**: `mercadinho-uniao`
  - **Public** (deixe assim)
  - Clique **"Create repository"**

### 3.3 Copiar URL
- Clique botão **"Code"** (verde)
- Copie URL HTTPS
- Você vai usar em breve

---

## PASSO 4: PUSH DO CÓDIGO (3 min)

### 4.1 Terminal/Git Bash
- Abra Git Bash ou Terminal
- Vá para pasta do projeto:
  ```bash
  cd "d:\JD\Trabalho\Projetos Reais\Projetos Em Andamento\Mercadinho União"
  ```

### 4.2 Inicializar Git Local
```bash
git init
git add .
git commit -m "Initial commit - Mercadinho União"
git branch -M main
git remote add origin https://github.com/seu_usuario/mercadinho-uniao.git
git push -u origin main
```

✅ Seu código está no GitHub!

---

## PASSO 5: DEPLOY BACKEND - RENDER (8 min)

### 5.1 Abrir Render
- Vá para **[render.com](https://render.com)**
- Na dashboard, clique **"New +"**
- Selecione **"Web Service"**

### 5.2 Conectar GitHub
- Clique **"Connect account"** (se pedido)
- Autorize GitHub
- Selecione repositório **`mercadinho-uniao`**

### 5.3 Configurar Web Service

**Preencha assim:**
- **Name**: `mercadinho-uniao-api`
- **Environment**: `Node` (selecione na dropdown)
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Region**: Escolha a mais próxima

### 5.4 Environment Variables (IMPORTANTE!)
- Clique em **"Add Environment Variable"**
- Adicione uma por uma:

```
DB_HOST = postgres-xxxxx.c.aivencloud.com
DB_PORT = 5432
DB_USER = admin
DB_PASSWORD = sua_senha_do_banco
DB_NAME = mercadinho_db
PORT = 3000
NODE_ENV = production
JWT_SECRET = mercadinho123secret456789
CORS_ORIGIN = http://localhost:5000,http://localhost:3000
```

### 5.5 Deploy
- Clique **"Create Web Service"**
- Render vai fazer deploy (~5 minutos)
- Você verá os logs
- Quando ficar verde = está online!

### 5.6 Pegar URL
- Na dashboard do service
- Copie URL: `https://mercadinho-uniao-api.onrender.com`
- Você vai usar em breve

**Teste health check:**
- Abra no navegador: `https://mercadinho-uniao-api.onrender.com/health`
- Deve mostrar: `{"status":"OK","message":"Servidor rodando"}`

✅ Backend online!

---

## PASSO 6: DEPLOY FRONTEND - NETLIFY (5 min)

### 6.1 Atualizar API URL
- Abra arquivo: `frontend/js/api.js`
- Linha 1, mude para:
  ```javascript
  const API_BASE_URL = 'https://mercadinho-uniao-api.onrender.com/api';
  ```
- Salve o arquivo

### 6.2 Push para GitHub
```bash
git add frontend/js/api.js
git commit -m "Update API URL to Render"
git push origin main
```

### 6.3 Abrir Netlify
- Vá para **[netlify.com](https://netlify.com)**
- Clique **"Sign up"** e use GitHub para registrar

### 6.4 Deploy Automático
- Na dashboard, clique **"Add new site"** → **"Import an existing project"**
- Clique **"GitHub"**
- Selecione repositório **`mercadinho-uniao`**

### 6.5 Configurações Build
- **Base directory**: `frontend`
- **Build command**: (deixe vazio)
- **Publish directory**: `frontend`
- Clique **"Deploy site"**

Netlify irá fazer deploy (~2 minutos)

### 6.6 Pegar URL do Frontend
- Após deploy, você terá URL: `https://xxxxx.netlify.app`
- Use este URL para acessar!

✅ Frontend online!

---

## PASSO 7: TESTAR TUDO (5 min)

### 7.1 Abra o Frontend
- Acesse: `https://seu-site.netlify.app`
- Veja se carrega sem erros

### 7.2 Registrar Usuário
- Clique **"Entrar"** → **"Registrar-se"**
- Preencha:
  - Nome: Teste Silva
  - Email: teste@teste.com
  - Telefone: 11999999999
  - Senha: teste123
- Clique **"Registrar"**

✅ Se funcionar = Backend e frontend se conectaram!

### 7.3 Ver Produtos
- Deve aparecer lista de produtos
- Clique em categoria para filtrar
- Busque um produto

### 7.4 Adicionar ao Carrinho
- Clique em qualquer produto
- Modal aparece
- Aumente quantidade
- Clique **"Adicionar"**
- Vea badge do carrinho aparecer

### 7.5 Fazer Pedido
- Clique **Carrinho**
- Clique **"Ir para Pagamento"**
- Preencha endereço
- Escolha forma de pagamento
- Clique **"Confirmar Pedido"**

### 7.6 Ver Pedido
- Clique **"Meus Pedidos"**
- Deve aparecer o pedido criado

✅ Sistema 100% FUNCIONAL!

---

## 📊 URLs Finais

Salve essas URLs:

```
FRONTEND: https://seu-site.netlify.app
BACKEND:  https://mercadinho-uniao-api.onrender.com
DATABASE: (apenas interna no Render)
```

---

## 🔄 Fazer Mudanças Depois

Sempre que quiser mudança:

1. Edite no VS Code
2. Commit + push:
   ```bash
   git add .
   git commit -m "Descrição"
   git push origin main
   ```
3. Render/Netlify redeploy automaticamente
4. Teste na URL

Tudo acontece em ~2 minutos!

---

## ⚠️ Erros Comuns

| Erro | Solução |
|------|---------|
| CORS Error | Verifique CORS_ORIGIN no Render env |
| 404 Not Found | Backend URL errada em api.js |
| Database Connection Failed | URL BD errada, senha errada, SQL não rodou |
| Netlify erro | Build falhou - check console do site |

---

## ✅ Checklist - Você terminou quando:

- [ ] PostgreSQL criado e rodando
- [ ] SQL executado no banco
- [ ] GitHub repo criado com código
- [ ] Backend deployado no Render
- [ ] Frontend deployado no Netlify
- [ ] Consegue fazer login
- [ ] Consegue ver produtos
- [ ] Consegue fazer pedido
- [ ] Consegue rastrear pedido

---

**Você está ONLINE e TESTANDO NA PRÁTICA! 🌐🎉**

Nenhuma máquina local, tudo na internet!
