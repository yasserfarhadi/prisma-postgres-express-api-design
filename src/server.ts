import express from 'express';
import router from './router';
import { protect } from './modules/auth';
import { createUser, signIn } from './handlers/user';
import type { NextFunction, Request, Response } from 'express';
import { ErrorMessage } from './modules/error';
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', protect, router);
app.post('/user', createUser);
app.post('/signin', signIn);

app.use(
  (err: ErrorMessage, req: Request, res: Response, next: NextFunction) => {
    if (err.type === 'auth') {
      res
        .status(err.status || 401)
        .json({ message: err.message || 'Unauthorized' });
    } else if (err.type === 'input') {
      res
        .status(err.status || 400)
        .json({ mnessage: err.message || 'Invalid input' });
    } else if (err.type === 'db') {
      res
        .status(err.status || 500)
        .json({ message: err.message || 'Thats on us!' });
    } else {
      res.status(500).json({ message: 'error with no type' });
    }
  }
);

export default app;
