import express from 'express';
import multer from 'multer';

const app = express();

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('picture'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Kuva ei ole valittu');
        }

        res.status(201).send('Kuva ladattu onnistuneesti');
    } catch (error) {
        console.error('Virhe kuvan lataamisessa:', error);
        res.status(500).send('Jotain meni pieleen');
    }
});

export default app;
