import express from 'express';
import userRouter from './routes/user-router.js';
import kuvaRouter from './routes/kuva-router.js';

const router = express.Router();
router.use('/kayttaja', userRouter);
router.use('/kayttajaKuva', kuvaRouter);

export default router;