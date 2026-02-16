# 🐛 Solução de Problemas - Cloud Deploy

## Se Algo Não Funcionar

### ❌ "Frontend não consegue conectar ao backend"

**Sintoma:** Ao tentar registrar, dá erro de conexão

**Solução:**

1. Verifique se backend está rodando:
   - Abra no navegador: `https://mercadinho-uniao-api.onrender.com/health`
   - Deve mostrar JSON com "OK"

2. Se não funciona, backend pode estar dormindo:
   - Vá para Render dashboard
   - Clique em seu service
   - Clique **"Manual Deploy"** ou **"Redeploy"**
   - Aguarde ficar verde

3. Verifique console do navegador (F12):
   - Qual é o erro exato?
   - Qual URL está tentando acessar?

---

### ❌ "Database Connection Failed"

**Sintoma:** Backend mostra erro de banco de dados

**Solução:**

1. No Render, vá para seu banco (PostgreSQL)
   - Clique em **"Browser"**
   - Faça query: `SELECT NOW();`
   - Se funciona = banco tá ok

2. Verifique variáveis no backend:
   - Render → mercadinho-uniao-api
   - Clique **"Environment"**
   - Verifique cada variável:
     - DB_HOST = correto?
     - DB_USER = correto?
     - DB_PASSWORD = correto (sem espaços)?
     - DB_NAME = `mercadinho_db`?
     - Port = `5432`?

3. Se mudou variáveis:
   - Clique **"Redeploy"**
   - Aguarde

---

### ❌ "CORS error"

**Sintoma:** Frontend consegue acessar, mas vê erro de CORS

**Erro tipo:**
```
Access to XMLHttpRequest from 'https://seu-site.netlify.app'
blocked by CORS policy
```

**Solução:**

1. No Render, abra seu backend
2. Clique **"Environment"**
3. Procure por `CORS_ORIGIN`
4. Edite e adicione a URL do frontend:
   ```
   https://seu-site.netlify.app
   ```

5. Salve e **Redeploy**

---

### ❌ "Products não aparecem"

**Sintoma:** Frontend abre, mas não mostra produtos

**Solução:**

1. F12 → Network → veja requisição para `/products`
   - Status 200? (sucesso) ou 500? (erro)

2. Se erro 500, no Render:
   - Backend → **Logs**
   - Procure por mensagem de erro
   - Geralmente é erro de SQL

3. Verifique se SQL foi executado:
   - Render → banco
   - Browser → rode: `SELECT * FROM products;`
   - Deve mostrar 10 produtos

4. Se não tem produtos:
   - No Browser, execute INSERT novamente:
   ```sql
   INSERT INTO products (name, category, price, stock) VALUES
   ('Pão', 'padaria', 0.50, 500),
   ('Maçã', 'quitanda', 2.00, 300);
   ```

---

### ❌ "Login não funciona"

**Sintoma:** Registra mas não consegue fazer login

**Solução:**

1. F12 → Network → veja resposta do `/login`
   - Qual é a mensagem de erro?

2. Verifique se usuário foi criado:
   - Render → banco → Browser
   - Execute: `SELECT * FROM users;`
   - Vê seu usuário?

3. Se não vê usuário:
   - Tentou registrar mesmo?
   - Viu mensagem de sucesso?
   - Check F12 Console para erros

4. Se vê usuário mas não consegue login:
   - Senha pode estar errada
   - Tente registrar de novo com senha diferente

---

### ❌ "Pedido não salva"

**Sintoma:** Clica "Confirmar Pedido" mas nada acontece

**Solução:**

1. F12 → Console → vê erros?

2. Verifique se está logado:
   - Token existe no localStorage?
   - F12 → Application → LocalStorage → vê `authToken`?

3. Se não tem token:
   - Faça login novamente
   - Deve salvar token

4. Se tem token:
   - Veja erro no Network (POST /orders)
   - Mensagem vai dizer o problema

5. Erro comum: "Total menor que 100"
   - Adicione mais produtos ao carrinho
   - Cada produto precisa de quantidade suficiente

---

### ❌ "Netlify diz Build Error"

**Sintoma:** Deploy falha no Netlify

**Solução:**

1. Clique no "Deploy" que falhou
2. Procure por erro na seção "Deploy logs"

3. Erros comuns:
   - **Syntaax error**: Frontend tem erro de JS
     - Abra `frontend/js/app.js`, `api.js`
     - Procure por erro (vírgula faltando, etc)
     - Corrija locally, commit, push

   - **File not found**: Caminho errado
     - Verifique **Base directory**: `frontend`
     - Verifique **Publish directory**: `frontend`

---

### ❌ "Render diz Application Error"

**Sintoma:** Backend diz erro genérico

**Solução:**

1. Vá para seu Web Service no Render
2. Clique em **"Logs"**
3. Procure pela linha com erro (é uma mensagem de erro específica)

4. Se diz `Cannot find module`:
   - `npm install` não rodou corretamente
   - Clique **"Redeploy"** no Render

5. Se diz `listen EADDRINUSE`:
   - Port já está em uso
   - Vá em Environment, mude PORT para algo diferente

---

### ❌ Nada funcionando?

**Checklist de debug:**

```
[ ] Backend health check responde? (https://url-api/health)
[ ] Banco Browser roda SELECT? (Render → banco → Browser)
[ ] Frontend abre sem erro JS? (F12 → Console vazio?)
[ ] Variáveis estão corretas? (Render → Environment)
[ ] Commits estão no GitHub? (git log)
[ ] Backend/Frontend tiveram redeploy? (após mudanças)
[ ] URLs hardcoded corretas? (api.js)
```

Se tudo acima OK, sistema deve funcionar!

---

## 📞 Dicas de Debug

### Ver logs em tempo real

**Backend:**
```
Render → mercadinho-uniao-api → Logs (atualiza em tempo real)
```

**Frontend:**
```
Netlify → Deploy → Logs (após deploy)
F12 Console (quando acessar site)
```

### Testar API direto

```bash
# Health check
curl https://mercadinho-uniao-api.onrender.com/health

# Listar produtos
curl https://mercadinho-uniao-api.onrender.com/api/products

# Testar login
curl -X POST https://mercadinho-uniao-api.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"senha123"}'
```

---

## 🔧 Se Quiser Fazer Mudanças

Fluxo correto:

```
1. Editar arquivo (VS Code)
2. Salvar (Ctrl+S)
3. Terminal: git add .
4. Terminal: git commit -m "descrição"
5. Terminal: git push origin main
6. Aguardar ~2 min redeploy
7. Testar na URL
```

---

## 💡 Pergunta: Por que Render fica offline?

Render free tier desativa apps que ficam sem requisições por 30 min.

**Solução:**
- Faça requisição para acordar (acesse frontend)
- Ou faça upgrade para plano pago
- Ou aceite que demora 1-2 seg na primeira requisição

---

## ✅ Sistema Funcionando = Quando...

- ✅ Backend responde em health check
- ✅ Database conecta e roda queries
- ✅ Frontend carrega sem erro JS
- ✅ Consegue fazer login
- ✅ Vê lista de produtos
- ✅ Adiciona ao carrinho
- ✅ Faz pedido
- ✅ Vê pedido em histórico

Se tudo isso funciona = **Sistema está ONLINE e OPERACIONAL!** 🎉

---

**Está travado? Qual é sua situação específica?**

Procure na tabela acima ou refaça os passos de DEPLOY_NA_NUVEM.md
