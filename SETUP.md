# 🚀 Guia de Configuração - Mercadinho União

## 1️⃣ Configurar Banco de Dados (Render.com)

### Passo 1: Criar Banco de Dados

1. Acesse [render.com](https://render.com)
2. Clique em "New +" → "PostgreSQL"
3. Preencha os dados:
   - **Name**: `mercadinho-uniao-db`
   - **Database**: `mercadinho_db`
   - **User**: `admin`
   - Deixe a password ser gerada automaticamente
4. Clique em "Create Database"

### Passo 2: Obter Connection String

1. Após criar, copie a **Internal Database URL**
2. Formato: `postgresql://user:password@host:port/database`

### Passo 3: Executar Schema

1. No Render, vá para a aba "Browser"
2. Cole todo o SQL de [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
3. Execute

✅ **Banco pronto!**

---

## 2️⃣ Configurar Backend

### Passo 1: Instalar Node.js

Se ainda não tem, baixe em [nodejs.org](https://nodejs.org)

### Passo 2: Configurar Variáveis de Ambiente

```bash
cd backend
cp .env.example .env
```

Edite `.env` com seus dados do Render:

```env
# Do Render
DB_HOST=seu-host-render.c.aivencloud.com
DB_PORT=5432
DB_USER=seu_usuario_render
DB_PASSWORD=sua_senha_render
DB_NAME=mercadinho_db

# Servidor
PORT=3000
NODE_ENV=development

# JWT - Gere uma chave aleatória
JWT_SECRET=sua_chave_123456_bem_segura_aqui

# CORS - Frontend rodando em localhost:5000
CORS_ORIGIN=http://localhost:5000,http://localhost:3000
```

### Passo 3: Instalar Dependências

```bash
npm install
```

### Passo 4: Testar Conexão

```bash
npm start
```

Você verá:
```
✅ Banco de dados conectado
🚀 Servidor rodando em http://localhost:3000
```

**Ctrl+C** para parar o servidor

---

## 3️⃣ Executar Frontend

### Padrão 1: Abrir Diretamente (Mais Rápido)

1. Abra `frontend/index.html` no navegador
   - Funciona direto sem servidor
   - Usa dados mock para testar

### Padrão 2: Com Live Server (Recomendado)

1. Instale a extensão VS Code: "Live Server"
2. Clique direito em `frontend/index.html`
3. Selecione "Open with Live Server"
4. Abre em `http://localhost:5500`

---

## 4️⃣ Conectar Frontend ao Backend

### Edite `frontend/js/api.js` - Linha 1:

**Antes:**
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

Se o backend está rodando em outra porta, mude para:
```javascript
const API_BASE_URL = 'http://seu-dominio-render.onrender.com/api';
```

---

## 5️⃣ Deploy na Nuvem (Render)

### Backend

1. Crie conta no [Render.com](https://render.com)
2. Conecte seu GitHub
3. Clique "New +" → "Web Service"
4. Selecione seu repositório
5. Preencha:
   - **Name**: `mercadinho-uniao-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Adicione variáveis de ambiente em "Environment"
7. Clique "Create Web Service"

### Frontend

1. No Render, clique "New +" → "Static Site"
2. Selecione seu repositório
3. Preencha:
   - **Name**: `mercadinho-uniao-frontend`
   - **Publish Directory**: `frontend`
4. Clique "Create Static Site"

---

## 🧪 Testar API com cURL

### Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@test.com",
    "phone": "11999999999",
    "password": "senha123"
  }'
```

Resposta:
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@test.com",
    "phone": "11999999999"
  },
  "token": "eyJhbGc..."
}
```

### Fazer Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@test.com",
    "password": "senha123"
  }'
```

### Listar Produtos

```bash
curl http://localhost:3000/api/products
```

### Criar Pedido (com token)

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token_aqui" \
  -d '{
    "items": [
      {"id": 1, "name": "Pão Francês", "price": 0.50, "quantity": 200}
    ],
    "total": 100.00,
    "delivery": {
      "address": "Rua Principal",
      "neighborhood": "Centro",
      "cep": "01310100",
      "number": "123"
    },
    "paymentMethod": "pix"
  }'
```

---

## 📊 Estrutura de Pastas Final

```
mercadinho-uniao/
├── frontend/
│   ├── index.html
│   ├── css/styles.css
│   ├── js/app.js
│   ├── js/api.js
│   ├── js/cart.js
│   └── pages/
│       ├── cart.html
│       ├── checkout.html
│       └── orders.html
│
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── models/ (User, Product, Order, Payment)
│   │   ├── routes/ (users, products, orders, payments)
│   │   ├── controllers/ (UserController, ProductController, OrderController, PaymentController)
│   │   ├── middleware/ (auth, validation)
│   │   ├── utils/helpers.js
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── DATABASE_SCHEMA.md
├── README.md
├── .gitignore
└── SETUP.md (este arquivo)
```

---

## ✅ Checklist de Preparação

- [ ] Banco PostgreSQL criado no Render
- [ ] SQL do schema executado
- [ ] Backend: `.env` configurado
- [ ] Backend: `npm install` executado
- [ ] Backend: `npm start` testado localmente
- [ ] Frontend: Abrindo corretamente no navegador
- [ ] API conectada ao frontend (teste de produto)
- [ ] Fluxo de compra testado (add carrinho → checkout → pedido)

---

## 🐛 Troubleshooting

### "Erro ao conectar ao banco"

```
✗ Banco de dados conectado
```

**Solução:**
- Verifique `.env` (host, user, password, database)
- Teste a connection string no Render diretamente
- Verifique firewall

### "CORS error no frontend"

**Solução:**
- Verifique `CORS_ORIGIN` em `.env` do backend
- Reinicie o servidor backend

### "Token inválido"

**Solução:**
- Gere um novo token fazendo login novamente
- Verifique `JWT_SECRET` em `.env`

### "Produto não encontrado"

**Solução:**
- Execute o SQL de exemplo em `DATABASE_SCHEMA.md`
- Insira produtos manualmente no banco

---

## 📞 Próximas Etapas

1. **Integração com Pagamento Real**
   - Integrar Stripe ou MercadoPago para cartão
   - Implementar webhooks para PIX

2. **Melhorias no Frontend**
   - Estilos responsivos completos
   - Animações
   - Sistema de notificações

3. **Admin Dashboard**
   - Gerenciar produtos
   - Ver pedidos
   - Relatórios

4. **Mobile App**
   - React Native ou Flutter

---

**Data:** 15 de fevereiro de 2026

Boa sorte com o Mercadinho União! 🎉
