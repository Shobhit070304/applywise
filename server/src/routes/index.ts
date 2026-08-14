import { Router } from 'express';
import healthRoute from './health.route';
import authRoute from './auth.route';
import profileRoute from './profile.route';
import jobRoute from './job.route';

const router = Router();

router.use('/', healthRoute);
router.use('/auth', authRoute);
router.use('/profile', profileRoute);
router.use('/jobs', jobRoute);

export default router;
