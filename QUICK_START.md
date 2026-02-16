# ⚡ QUICK START - Mercadinho União

## 🎯 Comece em 5 minutos

### Passo 1: Clonar/Navegar para o Projeto

```bash
cd "d:\JD\Trabalho\Projetos Reais\Projetos Em Andamento\Mercadinho União"
```

### Passo 2: Preparar Backend

```bash
cd backend
npm install
copy .env.example .env
```

❗ **Pausa aqui!** Edite `.env` com dados do seu Render

### Passo 3: Iniciar Backend

```bash
npm start
```

✅ Se ver: `🚀 Servidor rodando em http://localhost:3000`

### Passo 4: Testar Frontend

- Opção A: Abra `frontend/index.html` diretamente no navegador
- Opção B: Use Live Server (extensão VS Code)

### Passo 5: Testando

Você vê produtos? ✅ Sucesso!
- Clique em um produto
- Adicione ao carrinho
- Vá para checkout
- Tudo funciona? 🎉

---

## 📝 Configurar .env (IMPORTANTE!)

Copie valores do Render:

```env
DB_HOST=seu-postgres-xxxxx.c.aivencloud.com
DB_PORT=5432
DB_USER=avnadmin
DB_PASSWORD=sua_senha_aqui_com_caracteres_especiais
DB_NAME=defaultdb

PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_super_segura_123
CORS_ORIGIN=http://localhost:5000,http://localhost:3000
```

---

## ✅ Integração Passo a Passo

### 1. Banco de Dados

```
[ ] 1. Vá para render.com
[ ] 2. Crie PostgreSQL
[ ] 3. Copie connection string
[ ] 4. Cole em .env
[ ] 5. Teste conexão
```

**Teste tabelas:**
```bash
curl http://localhost:3000/health
```

Esperado: `{"status":"OK","message":"Servidor rodando"}`

### 2. Criar Usuário

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"test@test.com","phone":"11999999999","password":"123456"}'
```

Esperado: Token JWT + Dados usuário

### 3. Login

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

Copie o `token` gerado

### 4. Listar Produtos

```bash
curl http://localhost:3000/api/products
```

Se der erro, execute SQL de `DATABASE_SCHEMA.md`

### 5. Criar Pedido

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "items": [{"id": 1, "name": "Pão","price": 0.50, "quantity": 200}],
    "total": 100,
    "delivery": {"address": "Rua A", "neighborhood": "Centro", "cep": "01310100", "number": "123"},
    "paymentMethod": "dinheiro"
  }'
```

---

## 🐛 Problemas Comuns

| Problema | Solução |
|----------|---------|
| `ECONNREFUSED` | Backend não rodando. Faz `npm start` |
| `CORS error` | Frontend em porta diferente do CORS_ORIGIN |
| `Password auth failed` | Credenciais Render erradas no .env |
| `relation "users" does not exist` | SQL do banco não executado |
| `Invalid token` | Copie o token correto do login |

---

## 📊 Estrutura Minimista

Frontend mínimo rodando? Pronto!

```
frontend/index.html ← Abra aqui
    ↓
fetch() para backend ← Em localhost:3000
    ↓
Backend responde ← Com dados do PostgreSQL
```

---

## 🎮 Testar Fluxo Completo

1. **Login/Registro:**
   Clique "Entrar" → Registre-se

2. **Produtos:**
   Visualize catálogo com dados mock

3. **Carrinho:**
   Adicione produtos → vá para cart.html

4. **Checkout:**
   Preencha dados → escolha pagamento

5. **Confirmação:**
   Vá para orders.html → veja pedido

---

## 💡 Dicas

✨ Use `Ctrl+Shift+Del` para limpar localStorage e testar carrinho vazio

✨ Postman é seu amigo para testar API sem frontend

✨ `npm run dev` (com nodemon) = reload automático do backend

✨ Browser DevTools F12 = veja requests/responses

---

## 🚨 ANTES DE COMEÇAR

- [ ] Node.js instalado? `node --version`
- [ ] Banco Render criado? Com PostgreSQL
- [ ] SQL executado no Render?
- [ ] .env preenchido com credenciais reais?

---

## 🎯 Meta: Em 30 minutos

```
5 min   → Instalar dependências
10 min  → Configurar .env
5 min   → Testar Backend
5 min   → Testar Frontend
5 min   → Fazer compra teste
```

---

## ✨ Próxima Fase

Quando tudo funcionar:
- Estilos CSS avançados
- Admin dashboard
- Pagamentos reais
- Mobile responsivo

---

**Agora é com você!** 💪

Se travar em algo, volte a **SETUP.md** para detalhes.

Good luck! 🚀
