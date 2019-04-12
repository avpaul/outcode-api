import express from 'express';
import apiRouter from './api';
import viewsRouter from './views';

const router = express.Router();

router.use('/api', apiRouter);
router.use(viewsRouter);

export default router;
