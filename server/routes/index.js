import express from 'express';
import articleRoutes from './articleRoutes';

const router = express.Router();

router.get('/api/', (req, res) => {
  res.status(200).json({ message: 'Outcode API, Up and running' });
});

router.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Outcode API, Up and running' });
});

router.use('/api/', articleRoutes);

export default router;
