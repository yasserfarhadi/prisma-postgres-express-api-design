import type { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { ErrorMessage } from './error';

export const handleInputErrors: RequestHandler = (req, _, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ErrorMessage('input', 'wrong inputs', 400));
  }
  next();
};
