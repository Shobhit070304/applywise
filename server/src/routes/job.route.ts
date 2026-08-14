import { Router } from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/job.controller';
import { authenticate, requireRole } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

router.post('/', authenticate, requireRole('admin'), createJob);
router.put('/:id', authenticate, requireRole('admin'), updateJob);
router.delete('/:id', authenticate, requireRole('admin'), deleteJob);

export default router;
