import express from 'express';
import userRouter from './routes/user-router.js';

const router = express.Router();
router.use('/asiakas', userRouter);

export default router;