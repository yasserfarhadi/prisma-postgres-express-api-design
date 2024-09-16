import express from 'express';
import router from './router';
import { protect } from './modules/auth';
import { createUser, signIn } from './handlers/user';

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', protect, router);
app.post('/user', createUser);
app.post('/signin', signIn);

export default app;
