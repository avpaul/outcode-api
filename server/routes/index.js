import express from 'express';
import articleRoutes from './articleRoutes';
import userRoutes from './userRoutes';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Outcode API, Up and running' });
});

router.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Outcode API, Up and running' });
});
router.use('/api/auth', userRoutes);
router.use('/api', articleRoutes);

export default router;
