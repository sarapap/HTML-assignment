import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', api);

app.options('/api/v1/kayttaja', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();  // 204 tarkoittaa, että ei ole sisältöä palautettavaksi
});

app.use((req, res, next) => {
    const token = req.cookies.auth_token;  // Hae token evästeestä

    if (!token) {
        return res.status(401).json({ error: 'Autentikointitoken puuttuu' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);  // Varmista tokenin aitous
        req.user = decoded;  // Lisää käyttäjä tietoihin
        next();  // Jatka seuraavaan middlewareen
    } catch (error) {
        res.status(401).json({ error: 'Virheellinen autentikointitoken' });
    }
});


const SECRET_KEY = 'mysecretkey';

app.post('/api/v1/kayttaja/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ user_id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.cookie('auth_token', token, { httpOnly: true, secure: true });
        res.json({ success: true, user_id: user.id });
    } else {
        res.status(401).json({ success: false, error: 'Väärä käyttäjätunnus tai salasana' });
    }
});

app.post('/api/v1/kayttaja/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true, message: 'Uloskirjautuminen onnistui' });
});


app.listen(3000, () => {
    console.log('Palvelin käynnissä portissa 3000');
});


export default app;

