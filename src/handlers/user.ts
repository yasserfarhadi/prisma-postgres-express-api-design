import type { RequestHandler } from 'express';
import prisma from '../db';
import { comparePasswords, createJWT, hashPassword } from '../modules/auth';

export const createUser: RequestHandler = async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUser) {
    res.status(409);
    res.json({ message: 'username already taken' });
  }

  const user = await prisma.user.create({
    data: {
      username,
      password: await hashPassword(password),
    },
  });
  const token = createJWT(user);
  res.json({ token });
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
