import express from 'express';
import api from './api/index.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', api);

/*const upload = multer({ dest: 'uploads/' });

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
});*/

export default app;
