require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// Testar conexão com banco de dados
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('✅ Banco de dados conectado');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📖 API disponível em http://localhost:${PORT}/api`);
});
