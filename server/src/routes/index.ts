import { Router } from 'express';
import healthRoute from './health.route';
import authRoute from './auth.route';
import profileRoute from './profile.route';

const router = Router();

router.use('/', healthRoute);
router.use('/auth', authRoute);
router.use('/profile', profileRoute);

export default router;
