import { postKuva, getKuva, getKuvaByName, getKuvaById, putKuva, deleteKuva } from '../controller/kuva-controller.js';
import express from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.png');
    },
});

const upload = multer({ storage });

const kuvaRouter = express.Router();

kuvaRouter.route('/profiilikuva/:id').post(upload.single('kuva'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "Tiedostoa ei löydy." });
    }
    postKuva(req, res, next);
});

kuvaRouter.route('/profiilikuva').get(getKuva);
kuvaRouter.route('/profiilikuva/nimi/:nimi').get(getKuvaByName);
kuvaRouter.route('/profiilikuva/:id').put(upload.single('kuva'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ error: "Tiedostoa ei löydy." });
    }
    putKuva(req, res, next);
});
kuvaRouter.route('/profiilikuva/:id').delete(deleteKuva).get(getKuvaById);


export default kuvaRouter;