# 📦 Mercadinho União - Delivery

Projeto completo de um sistema de delivery para mercadinho com padaria, quitanda e açougue.

## 🎯 Estrutura do Projeto

```
mercadinho-uniao/
├── frontend/              # Interface do cliente (HTML5, CSS3, JavaScript)
│   ├── index.html        # Página principal (catálogo)
│   ├── css/styles.css    # Estilos globais
│   ├── js/
│   │   ├── api.js        # Cliente API
│   │   ├── cart.js       # Gerenciador de carrinho
│   │   └── app.js        # Lógica principal
│   ├── pages/
│   │   ├── cart.html     # Página do carrinho
│   │   ├── checkout.html # Página de pagamento
│   │   └── orders.html   # Histórico de pedidos
│   └── assets/           # Imagens e recursos
│
├── backend/              # API RESTful (Node.js + Express)
│   ├── src/
│   │   ├── config/       # Configurações (DB, envs)
│   │   ├── models/       # Modelos de dados
│   │   ├── routes/       # Endpoints da API
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── middleware/   # Middlewares (auth, validação)
│   │   ├── utils/        # Funções auxiliares
│   │   └── app.js        # Configuração Express
│   ├── server.js         # Entry point
│   ├── package.json      # Dependências
│   ├── .env.example      # Variáveis de ambiente
│   └── DATABASE_SCHEMA.md # Schema do banco
│
└── README.md             # Este arquivo
```

## 🚀 Recursos

- ✅ Catálogo de produtos (Padaria, Quitanda, Açougue)
- ✅ 10.000+ produtos em estoque
- ✅ Carrinho de compras (localStorage)
- ✅ Autenticação de usuário
- ✅ 3 formas de pagamento:
  - 💵 Dinheiro
  - 💳 Cartão
  - 🔷 PIX (dinâmico)
- ✅ Rastreamento de pedidos
- ✅ Mínimo de entrega: R$ 100,00

## 📋 Começando

### Frontend

1. Abra `frontend/index.html` em um navegador
2. Funciona sem servidor (modo demo com dados fake)

### Backend

#### 1. Configurar Banco de Dados (Render)

1. Vá para [render.com](https://render.com)
2. Crie um banco PostgreSQL gratuito
3. Copie a connection string
4. Execute o SQL em `DATABASE_SCHEMA.md`

#### 2. Instalar Dependências

```bash
cd backend
npm install
```

#### 3. Configurar Variáveis de Ambiente

```bash
# Copie .env.example para .env
cp .env.example .env

# Preencha com seus dados:
DB_HOST=seu_host_render.onrender.com
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
JWT_SECRET=sua_chave_secreta
CORS_ORIGIN=http://localhost:5000
```

#### 4. Iniciar o Servidor

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

O servidor estará em `http://localhost:3000`

## 📡 API Endpoints

### Usuários
- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Fazer login
- `GET /api/users/profile` - Obter perfil (protegido)
- `PUT /api/users/profile` - Atualizar perfil (protegido)

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Obter produto
- `GET /api/products/categories` - Listar categorias
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Atualizar produto (admin)

### Pedidos
- `POST /api/orders` - Criar pedido (protegido)
- `GET /api/orders` - Listar meus pedidos (protegido)
- `GET /api/orders/:id` - Obter pedido (protegido)
- `PUT /api/orders/:id` - Atualizar status (admin)
- `DELETE /api/orders/:id` - Cancelar pedido (protegido)

### Pagamentos
- `POST /api/payments/pix` - Gerar QR Code PIX (protegido)
- `POST /api/payments/process` - Processar pagamento (protegido)
- `GET /api/payments/:orderId` - Obter pagamento (protegido)

## 🔐 Autenticação

As rotas protegidas usam JWT (JSON Web Token).

**Header obrigatório:**
```
Authorization: Bearer seu_token_aqui
```

## 💾 Banco de Dados

Tabelas:
- `users` - Usuários do sistema
- `products` - Catálogo de produtos
- `orders` - Pedidos dos clientes
- `order_items` - Itens de cada pedido
- `payments` - Informações de pagamento

## 🎨 Frontend - Próximos Passos

O frontend está pronto com funcionalidade básica. Próximas melhorias:

- [ ] Sistema de estilos completo
- [ ] Tema responsivo para mobile
- [ ] Animações e transições
- [ ] Integração completa com backend
- [ ] Notificações push
- [ ] Dashboard do admin

## ⚙️ Variáveis de Ambiente

```
DB_HOST          - Host do banco PostgreSQL
DB_PORT          - Porta (padrão: 5432)
DB_USER          - Usuário do banco
DB_PASSWORD      - Senha do banco
DB_NAME          - Nome do banco
PORT             - Porta do servidor (padrão: 3000)
NODE_ENV         - Ambiente (development/production)
JWT_SECRET       - Chave para gerar tokens
CORS_ORIGIN      - Origem permitida para CORS
PIX_KEY          - Chave PIX para pagamentos
EMAIL_USER       - Email para enviar notificações
EMAIL_PASSWORD   - Senha de app
```

## 📝 Exemplo de Requisição

**Registrar usuário:**
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "11999999999",
    "password": "senha123"
  }'
```

**Criar pedido:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token" \
  -d '{
    "items": [
      {"id": 1, "name": "Pão", "price": 0.50, "quantity": 5}
    ],
    "total": 100.00,
    "delivery": {
      "address": "Rua A",
      "neighborhood": "Centro",
      "cep": "01310100",
      "number": "123"
    },
    "paymentMethod": "pix"
  }'
```

## 🤝 Contribuir

Este é um projeto em desenvolvimento. Contribuições são bem-vindas!

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Última atualização:** 15 de fevereiro de 2026
