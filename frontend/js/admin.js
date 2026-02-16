// Admin JS: manage products, orders, users, payments

const panel = document.getElementById('panel');
const tabs = document.querySelectorAll('.tab');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const adminUser = document.getElementById('admin-user');

let currentTab = 'products';

function render() {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === currentTab));
    if (currentTab === 'products') renderProducts();
    if (currentTab === 'orders') renderOrders();
    if (currentTab === 'users') renderUsers();
    if (currentTab === 'payments') renderPayments();
}

tabs.forEach(t => t.addEventListener('click', () => { currentTab = t.dataset.tab; render(); }));

btnLogin.addEventListener('click', () => {
    const email = prompt('Email admin:');
    const password = prompt('Senha:');
    if (!email || !password) return alert('Credenciais necessárias');
    api.login(email, password).then(res => {
        updateAuthUI();
        render();
        alert('Logado como ' + (res.user?.name || res.user?.email));
    }).catch(e => alert('Erro login: ' + (e.message || e)));
});

btnLogout.addEventListener('click', async () => {
    await api.logout();
    updateAuthUI();
    render();
});

function updateAuthUI(){
    const user = getCurrentUser();
    if (isAuthenticated()){
        btnLogin.style.display = 'none';
        btnLogout.style.display = 'inline-block';
        adminUser.textContent = user ? `${user.name} (${user.email})` : '';
    } else {
        btnLogin.style.display = 'inline-block';
        btnLogout.style.display = 'none';
        adminUser.textContent = '';
    }
}

// PRODUCTS
async function renderProducts(){
    panel.innerHTML = `
      <h2>Produtos</h2>
      <div style="margin-bottom:14px">
        <form id="form-add-product">
          <div class="row">
            <input name="name" placeholder="Nome" required />
            <input name="category" placeholder="Categoria" required />
            <input name="price" placeholder="Preço" required />
            <input name="stock" placeholder="Estoque" required />
            <input name="image_url" placeholder="Image URL" />
            <button class="btn btn-primary" type="submit">Adicionar</button>
          </div>
        </form>
      </div>
      <div id="products-table"></div>
    `;

    document.getElementById('form-add-product').addEventListener('submit', async (e) => {
        e.preventDefault();
        const f = e.target;
        const product = {
            name: f.name.value,
            category: f.category.value,
            price: parseFloat(f.price.value) || 0,
            stock: parseInt(f.stock.value) || 0,
            image_url: f.image_url.value || null
        };
        try{
            await createProduct(product);
            alert('Produto criado');
            renderProducts();
        }catch(err){ alert('Erro: ' + (err.message || err)); }
    });

    // load products
    const data = await api.getProducts();
    const list = data.products || data || [];
    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Id</th><th>Nome</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Ações</th></tr>`;
    list.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>R$ ${Number(p.price).toFixed(2)}</td>
          <td>${p.stock}</td>
          <td class="flex">
            <button class="btn" data-id="${p.id}" data-action="edit">Editar</button>
            <button class="btn btn-danger" data-id="${p.id}" data-action="delete">Excluir</button>
          </td>`;
        table.appendChild(tr);
    });
    document.getElementById('products-table').appendChild(table);

    document.querySelectorAll('button[data-action="edit"]').forEach(b => b.addEventListener('click', async (e)=>{
        const id = e.target.dataset.id;
        const p = await api.getProductById(id);
        const name = prompt('Nome', p.name);
        const category = prompt('Categoria', p.category);
        const price = prompt('Preço', p.price);
        const stock = prompt('Estoque', p.stock);
        try{ await updateProduct(id,{name,category,price: parseFloat(price)||0,stock:parseInt(stock)||0}); alert('Atualizado'); renderProducts(); }
        catch(err){ alert('Erro: '+(err.message||err)); }
    }));

    document.querySelectorAll('button[data-action="delete"]').forEach(b => b.addEventListener('click', async (e)=>{
        const id = e.target.dataset.id;
        if (!confirm('Excluir produto '+id+'?')) return;
        try{ await deleteProduct(id); alert('Excluído'); renderProducts(); }catch(err){ alert('Erro: '+(err.message||err)); }
    }));
}

// ORDERS
async function renderOrders(){
    panel.innerHTML = `<h2>Pedidos</h2><div id="orders-table"></div>`;
    const data = await api.getOrders();
    const list = data.orders || data || [];
    const table = document.createElement('table');
    table.innerHTML = `<tr><th>Id</th><th>Usuário</th><th>Total</th><th>Status</th><th>Ações</th></tr>`;
    list.forEach(o=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${o.id}</td>
          <td>${o.user_id}</td>
          <td>R$ ${Number(o.total).toFixed(2)}</td>
          <td>${o.status}</td>
          <td class="flex">
            <button class="btn" data-id="${o.id}" data-action="view">Ver</button>
            <button class="btn btn-primary" data-id="${o.id}" data-action="next">Avançar Status</button>
          </td>`;
        table.appendChild(tr);
    });
    document.getElementById('orders-table').appendChild(table);

    document.querySelectorAll('button[data-action="view"]').forEach(b=>b.addEventListener('click', async e=>{
        const id = e.target.dataset.id; const order = await api.getOrderById(id);
        alert(JSON.stringify(order, null, 2));
    }));

    document.querySelectorAll('button[data-action="next"]').forEach(b=>b.addEventListener('click', async e=>{
        const id = e.target.dataset.id;
        const nextStatus = prompt('Defina novo status (pendente, confirmado, a-caminho, entregue, cancelado):');
        if(!nextStatus) return;
        try{
            await updateOrderStatus(id, nextStatus);
            alert('Status atualizado'); renderOrders();
        }catch(err){ alert('Erro: '+(err.message||err)); }
    }));
}

// USERS
async function renderUsers(){
    panel.innerHTML = `<h2>Usuários</h2><div id="users-table"></div>`;
    // There's no direct API getAllUsers in api.js - call endpoint
    try{
        const res = await fetch(`${API_BASE_URL}/users`,{ headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
        if(!res.ok) throw new Error('Erro ao buscar usuários');
        const data = await res.json();
        const list = data.users || data || [];
        const table = document.createElement('table');
        table.innerHTML = `<tr><th>Id</th><th>Nome</th><th>Email</th><th>Telefone</th></tr>`;
        list.forEach(u=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.phone||''}</td>`;
            table.appendChild(tr);
        });
        document.getElementById('users-table').appendChild(table);
    }catch(err){ document.getElementById('users-table').textContent = 'Erro: '+(err.message||err); }
}

// PAYMENTS
async function renderPayments(){
    panel.innerHTML = `<h2>Pagamentos</h2><div id="payments-table"></div>`;
    try{
        const res = await fetch(`${API_BASE_URL}/payments`,{ headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
        if(!res.ok) throw new Error('Erro ao buscar pagamentos');
        const data = await res.json();
        const list = data.payments || data || [];
        const table = document.createElement('table');
        table.innerHTML = `<tr><th>Id</th><th>Order</th><th>Amount</th><th>Method</th><th>Status</th><th>Ações</th></tr>`;
        list.forEach(p=>{
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.id}</td><td>${p.order_id}</td><td>R$ ${Number(p.amount).toFixed(2)}</td><td>${p.method}</td><td>${p.status}</td>
              <td class="flex"><button class="btn btn-primary" data-id="${p.id}" data-action="approve">Aprovar</button>
              <button class="btn btn-danger" data-id="${p.id}" data-action="reject">Rejeitar</button></td>`;
            table.appendChild(tr);
        });
        document.getElementById('payments-table').appendChild(table);
        document.querySelectorAll('button[data-action="approve"]').forEach(b=>b.addEventListener('click', e=>updatePayment(e.target.dataset.id,'aprovado')));
        document.querySelectorAll('button[data-action="reject"]').forEach(b=>b.addEventListener('click', e=>updatePayment(e.target.dataset.id,'recusado')));
    }catch(err){ document.getElementById('payments-table').textContent = 'Erro: '+(err.message||err); }
}

// API helpers for admin actions
async function createProduct(product){
    const res = await fetch(`${API_BASE_URL}/products`,{
        method:'POST', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }, body: JSON.stringify(product)
    });
    if(!res.ok){ const d = await res.json(); throw new Error(d.message||'Erro criar produto'); }
    return await res.json();
}
async function updateProduct(id, product){
    const res = await fetch(`${API_BASE_URL}/products/${id}`,{
        method:'PUT', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }, body: JSON.stringify(product)
    });
    if(!res.ok){ const d = await res.json(); throw new Error(d.message||'Erro atualizar produto'); }
    return await res.json();
}
async function deleteProduct(id){
    const res = await fetch(`${API_BASE_URL}/products/${id}`,{ method:'DELETE', headers:{ 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } });
    if(!res.ok){ const d = await res.json(); throw new Error(d.message||'Erro deletar produto'); }
    return await res.json();
}
async function updateOrderStatus(id,status){
    const res = await fetch(`${API_BASE_URL}/orders/${id}`,{ method:'PUT', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }, body: JSON.stringify({ status }) });
    if(!res.ok){ const d = await res.json(); throw new Error(d.message||'Erro atualizar status'); }
    return await res.json();
}
async function updatePayment(id,status){
    fetch(`${API_BASE_URL}/payments/${id}`,{ method:'PUT', headers:{ 'Content-Type':'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }, body: JSON.stringify({ status }) })
    .then(async res=>{ if(!res.ok){ const d=await res.json(); throw new Error(d.message||'Erro'); } alert('Atualizado'); render(); })
    .catch(e=>alert('Erro: '+(e.message||e)));
}

// init
updateAuthUI(); render();
