import express from 'express';
import api from './api/index.js';
import cors from 'cors';
import { postUser } from './api/controller/user-controller.js';

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', api);

app.options('/api/v1/kayttaja', (req, res) => {
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
});

app.post('/api/v1/kayttaja', postUser);

app.use((req, res) => {
    res.status(404).json({ error: 'Reittiä ei löydy' });
});

app.use((err, req, res, next) => {
    console.error('Virhe:', err.message);
    res.status(500).json({ error: 'Jotain meni pieleen' });
});

app.listen(3000, () => {
    console.log('Palvelin käynnissä portissa 3000');
});


export default app;

