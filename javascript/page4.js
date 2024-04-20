'use strict';

import express from 'express';
import promisePool from 'utils/database.js';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/rekisteroidy', async (req, res) => {
    try {
        const { etunimi, sukunimi, puhelinnumero, sahkoposti, kayttajatunnus, salasana } = req.body;

        const [existingUserRows, existingUserFields] = await promisePool.execute(
            'SELECT * FROM kayttajat WHERE kayttajatunnus = ?',
            [kayttajatunnus]
        );

        if (existingUserRows.length > 0) {
            return res.status(400).send('Käyttäjätunnus on jo käytössä');
        }
        const [insertedRows, insertedFields] = await promisePool.execute(
            'INSERT INTO kayttajat (etunimi, sukunimi, puhelinnumero, sahkoposti, kayttajatunnus, salasana) VALUES (?, ?, ?, ?, ?, ?)',
            [etunimi, sukunimi, puhelinnumero, sahkoposti, kayttajatunnus, salasana]
        );

        res.status(201).send('Rekisteröityminen onnistui');
    } catch (error) {
        console.error('Virhe rekisteröitymisen käsittelyssä:', error);
        res.status(500).send('Jotain meni pieleen');
    }
});

app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});
