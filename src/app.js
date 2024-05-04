import express from 'express';
import api from './api/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use('/api/v1', api);

app.use((req, res) => {
    res.status(404).json({ error: 'Reittiä ei löydy' });
});

app.use((err, req, res, next) => {
    console.error('Virhe:', err.message);
    res.status(500).json({ error: 'Jotain meni pieleen' });
});
export default app;

