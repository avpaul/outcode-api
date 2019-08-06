import express from 'express';
import articleRoutes from './articleRoutes';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Outcode API, Up and running' });
});

router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Outcode API, Up and running' });
});

router.use('/', articleRoutes);

export default router;
