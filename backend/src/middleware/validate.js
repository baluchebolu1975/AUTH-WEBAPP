import { validationResult } from 'express-validator';
import { error } from '../utils/response.js';

export const validate = (req, res, next) => {
  const errs = validationResult(req);
  if (!errs.isEmpty())
    return error(res, 'Validation failed', 422, errs.array().map(e => ({ field: e.path, message: e.msg })));
  next();
};
