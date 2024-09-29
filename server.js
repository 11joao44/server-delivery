const { Sequelize } = require('sequelize');
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'https://graceful-manifestation-production.up.railway.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));



const PORT = process.env.PORT || 8000;

const sequelize = new Sequelize('postgresql://postgres:RTwuXjRgIzgGMLWOkwqOzQwWTdGYGXrZ@junction.proxy.rlwy.net:58426/railway');

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log('Conexão foi bem realizada com sucesso.');
    } catch (error) {
        console.error('Erro de conexão com base de dados:', error);
    }
}
authenticate();

const User = require('./src/models/user')(sequelize);

sequelize.sync({ force: false })
    .then(() => console.log('Modelos sincronizados com o banco de dados'))
    .catch(err => console.error('Erro ao sincronizar os modelos:', err));

app.post('/register', async (req, res) => {
    const { username, email, password, phone } = req.body;

    try {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).send('Usuário já existe');
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria um novo usuário
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
        });

        res.status(201).send('Cadastro realizado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao cadastrar usuário');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).send('Usuário não encontrado');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Senha inválida');
        }

        res.status(200).send('Login realizado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao realizar login');
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Erro ao buscar usuários');
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
