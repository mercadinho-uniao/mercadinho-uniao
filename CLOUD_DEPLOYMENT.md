# 🌐 Deploy Completo na Nuvem - Mercadinho União

## 🎯 Estratégia: Tudo na Internet desde o início

Você vai:
1. Criar banco PostgreSQL no Render
2. Fazer deploy do backend no Render
3. Fazer deploy do frontend no Netlify/Vercel
4. Testar tudo na internet em tempo real

**Tempo total:** ~30 minutos

---

## 1️⃣ BANCO DE DADOS (Render)

### Passo 1: Criar PostgreSQL

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"PostgreSQL"**
3. Preencha:
   - **Name**: `mercadinho-uniao-db`
   - **Database**: `mercadinho_db`
   - **User**: `admin`
   - **Region**: São Paulo
4. Clique **"Create Database"**

⏳ Aguarde ~2 minutos

### Passo 2: Executar Schema SQL

1. No Render, clique em sua database
2. Vá para a aba **"Browser"**
3. Cole TODO o SQL abaixo:

```sql
-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
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

-- Tabela de Pedidos
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

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pagamentos
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

-- Inserir produtos de exemplo
INSERT INTO products (name, description, category, price, stock) VALUES
('Pão Francês', 'Pão fresco do dia', 'padaria', 0.50, 500),
('Bolo de Chocolate', 'Bolo caseiro delicioso', 'padaria', 15.00, 50),
('Croissant', 'Massa folhada francês', 'padaria', 5.00, 100),
('Maçã Vermelha', 'Frutas frescas', 'quitanda', 2.00, 300),
('Banana Prata', 'Frutas da região', 'quitanda', 1.50, 400),
('Tomate Caqui', 'Tomate fresco', 'quitanda', 3.50, 200),
('Alface Crespa', 'Verdura fresca', 'quitanda', 4.00, 150),
('Acém', 'Carne vermelha premium', 'acougue', 25.00, 100),
('Filé Mignon', 'Carne nobre', 'acougue', 45.00, 50),
('Frango Inteiro', 'Frango de qualidade', 'acougue', 18.00, 80);
```

✅ Clique em **"Run"**

4. Copie a **Internal Database URL** (parecer: `postgresql://...`)

---

## 2️⃣ BACKEND (Render)

### Passo 1: Preparar Repositório GitHub

1. Se não tiver conta, crie em [github.com](https://github.com)
2. Crie novo repositório: `mercadinho-uniao`
3. Clone localmente:
   ```bash
   git clone https://github.com/seu_usuario/mercadinho-uniao.git
   cd mercadinho-uniao
   ```

4. Copie TODOS os arquivos (frontend + backend) para este diretório

5. Push para GitHub:
   ```bash
   git add .
   git commit -m "Initial commit - Mercadinho União"
   git push origin main
   ```

### Passo 2: Deploy Backend no Render

1. Acesse [render.com](https://render.com)
2. Clique **"New +"** → **"Web Service"**
3. Selecione seu repositório `mercadinho-uniao`
4. Preencha:
   - **Name**: `mercadinho-uniao-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Region**: São Paulo

5. Antes de "Create", vá para **"Environment"**

6. Adicione variáveis:
   ```
   DB_HOST=    (copiar do Render - postgres-xxxxx.c.aivencloud.com)
   DB_PORT=    5432
   DB_USER=    admin
   DB_PASSWORD= (copiar senha do Render)
   DB_NAME=    mercadinho_db
   PORT=       3000
   NODE_ENV=   production
   JWT_SECRET= seu_secret_aleatorio_aqui_123456789
   CORS_ORIGIN=https://seu-frontend.com,https://seu-frontend-prod.com
   ```

7. Clique **"Create Web Service"**

⏳ Aguarde deploy (~5 minutos)

✅ Você terá URL: `https://mercadinho-uniao-api.onrender.com`

### Passo 3: Testar Backend

```bash
curl https://mercadinho-uniao-api.onrender.com/health
```

Esperado:
```json
{"status":"OK","message":"Servidor rodando"}
```

---

## 3️⃣ FRONTEND (Netlify)

### Passo 1: Preparar Frontend

1. No arquivo `frontend/js/api.js`, mude linha 1:
   ```javascript
   const API_BASE_URL = 'https://mercadinho-uniao-api.onrender.com/api';
   ```

2. Commit e push:
   ```bash
   git add frontend/js/api.js
   git commit -m "Update API URL to Render"
   git push origin main
   ```

### Passo 2: Deploy no Netlify

1. Acesse [netlify.com](https://netlify.com) e faça login com GitHub
2. Clique **"New site from Git"**
3. Selecione repositório `mercadinho-uniao`
4. Preencha:
   - **Base directory**: `frontend`
   - **Build command**: (deixe em branco)
   - **Publish directory**: `frontend`

5. Clique **"Deploy"**

⏳ Aguarde deploy (~2 minutos)

✅ Você terá URL: `https://seu-site-id.netlify.app`

---

## 4️⃣ TESTAR NA PRÁTICA

### Teste 1: Registrar Usuário

1. Acesse sua URL do frontend
2. Clique **"Entrar"** → **"Registrar-se"**
3. Preencha:
   - Nome: João Teste
   - Email: joao@teste.com
   - Telefone: 11999999999
   - Senha: teste123

4. Clique **"Registrar"**

✅ Esperado: Login automático + Ver catálogo

### Teste 2: Procurar Produtos

1. Clique em **"Padaria"**
2. Veja produtos aparecendo
3. Busque por "Pão"

✅ Esperado: Aparecer "Pão Francês"

### Teste 3: Adicionar ao Carrinho

1. Clique em "Pão Francês"
2. Modal aparece
3. Aumente quantidade para 5
4. Clique **"Adicionar ao Carrinho"**

✅ Esperado: Ver badge "5" no carrinho

### Teste 4: Fazer Compra

1. Clique no ícone do **Carrinho**
2. Vja items listados
3. Clique **"Ir para Pagamento"**
4. Preencha dados:
   - Nome: João Teste
   - Endereço: Rua das Flores, 123
   - Bairro: Centro
   - CEP: 01310100

5. Escolha **"PIX"** ou **"Dinheiro"**
6. Clique **"Confirmar Pedido"**

✅ Esperado: Redirecion para "Meus Pedidos"

### Teste 5: Ver Histórico

1. Vá para **"Meus Pedidos"**
2. Veja pedido criado
3. Check status

✅ Esperado: Pedido aparecendo com status "Pendente"

---

## 🔧 Testar APIs Diretamente

Você pode testar usando **Postman** ou **cURL** com a URL real:

### Registrar
```bash
curl -X POST https://mercadinho-uniao-api.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@email.com","phone":"11999999999","password":"123456"}'
```

### Listar Produtos
```bash
curl https://mercadinho-uniao-api.onrender.com/api/products
```

### Criar Pedido
```bash
curl -X POST https://mercadinho-uniao-api.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"items":[{"id":1,"name":"Pão","price":0.50,"quantity":100}],"total":100,"delivery":{"address":"Rua A","neighborhood":"Centro","cep":"01310100","number":"123"},"paymentMethod":"dinheiro"}'
```

---

## 📊 URLs Finais

| Componente | URL |
|-----------|-----|
| Frontend | `https://seu-site.netlify.app` |
| Backend | `https://mercadinho-uniao-api.onrender.com` |
| Database | PostgreSQL no Render (apenas backend acessa) |

---

## 🔄 Fluxo de Desenvolvimento

Sempre que fizer mudanças:

1. **Edite os arquivos localmente**
2. **Git commit + push**
   ```bash
   git add .
   git commit -m "Descrição da mudança"
   git push origin main
   ```

3. **Render redeploy automaticamente** (backend)
4. **Netlify redeploy automaticamente** (frontend)
5. **Acesse URL para testar**

Tudo em ~2 minutos!

---

## ⚠️ Pontos Importantes

1. **CORS_ORIGIN** deve conter URL do frontend
2. **Database URL** debe ser a "Internal" (não "Public")
3. **JWT_SECRET** deve ser aleatório e seguro
4. **Sempre use HTTPS** na produção

---

## 🚨 Se Algo Não Funcionar

### Backend diz "Internal Server Error"

Vá em Render → Seu service → **"Logs"**

Procure por erro específico e resolva

### Frontend não consegue conectar

1. Verifique se API_BASE_URL está correta
2. Verifique CORS_ORIGIN no backend
3. F12 → Console → Veja erro exato

### Banco não conecta

1. URL interna do banco está correta?
2. SQL foi executado?
3. Verifique credenciais são as mesmas

---

## ✅ Checklist Final

- [ ] PostgreSQL criado no Render
- [ ] SQL executado (tabelas criadas)
- [ ] Repositório GitHub criado
- [ ] Backend deployado no Render
- [ ] Frontend deployado no Netlify
- [ ] API_BASE_URL aponta para Render
- [ ] Conseguem fazer login
- [ ] Conseguem ver produtos
- [ ] Conseguem fazer pedido
- [ ] Conseguem ver histórico

Se tudo ✅ = **SUCESSO!** 🎉

---

## 🎯 Próximos Testes Práticos

1. **Teste com vários usuários** (crie 3+ contas)
2. **Teste pedidos diferentes** (valores diferentes)
3. **Teste filtros** (cada categoria)
4. **Teste busca** (produtos variados)
5. **Teste pagamentos** (cada opção)
6. **Veja logs** de requisições no backend

---

**Tudo online, testável na internet! 🌐🚀**
