import type { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

export const handleInputErrors: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    res.status(400);
    res.json({ message: 'Wrong inputs', errors: errors.array() });
    return;
  }
  next();
};
