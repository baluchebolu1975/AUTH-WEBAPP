import { Router } from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import * as ctrl from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/users',        ctrl.listUsers);
router.get('/users/:id',    ctrl.getUser);
router.put('/users/:id',    ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

export default router;
