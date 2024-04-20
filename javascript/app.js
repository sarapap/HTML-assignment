import express from 'express';
import multer from 'multer';

const app = express();
const port = 3000;

// Tallennuskansio kuvatiedostoille
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('picture'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Kuva ei ole valittu');
        }

        // Tallenna kuvatiedosto tietokantaan tai tiedostojärjestelmään
        // Voit lisätä tässä koodin tallentamaan tiedoston tietokantaan tai palvelimelle

        res.status(201).send('Kuva ladattu onnistuneesti');
    } catch (error) {
        console.error('Virhe kuvan lataamisessa:', error);
        res.status(500).send('Jotain meni pieleen');
    }
});

app.listen(port, () => {
    console.log(`Palvelin käynnissä osoitteessa http://localhost:${port}`);
});
