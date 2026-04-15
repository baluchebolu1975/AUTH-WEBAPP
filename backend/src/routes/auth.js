import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import * as ctrl from '../controllers/authController.js';

const router = Router();

const passwordRules = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
  .matches(/[0-9]/).withMessage('Password must contain a number')
  .matches(/[@$!%*?&#^()_\-+=]/).withMessage('Password must contain a special character');

router.post('/signup', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be 2–50 characters').matches(/^[a-zA-Z\s'-]+$/).withMessage('First name contains invalid characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be 2–50 characters').matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name contains invalid characters'),
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters').matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  passwordRules,
  body('confirmPassword').custom((val, { req }) => {
    if (val !== req.body.password) throw new Error('Passwords do not match');
    return true;
  }),
  validate,
], ctrl.signup);

router.post('/login', [
  body('email').trim().isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
], ctrl.login);

router.post('/refresh', ctrl.refresh);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.me);

export default router;
