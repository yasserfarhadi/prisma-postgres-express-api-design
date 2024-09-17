import type { RequestHandler } from 'express';
import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';
import { ErrorMessage } from '../modules/error';

export const createUser: RequestHandler = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new ErrorMessage('input', 'username already taken', 409);
    }

    const user = await prisma.user.create({
      data: {
        username,
        password: await hashPassword(password),
      },
    });

    if (!user) {
      throw new ErrorMessage('db', 'Database Error', 500);
    }

    const token = createJWT(user);
    if (!token) {
      throw new ErrorMessage(
        'auth',
        'something went wrong when creating token',
        500
      );
    }
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

export const signIn: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    res.status(404);
    res.json({ message: 'User not found' });
    return;
  }

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) {
    res.status(401);
    res.json({ message: 'Wrong credentials' });
    return;
  }

  try {
    const token = createJWT(user);
    res.json({ token });
  } catch (err) {
    res.json({ message: 'Somthing went wrong' });
  }
};
