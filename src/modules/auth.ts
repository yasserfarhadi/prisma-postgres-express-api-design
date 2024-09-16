import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from 'prisma/prisma-client';

export const comparePasswords = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};

export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const createJWT = (user: User) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string
  );
  return token;
};

export const protect: RequestHandler = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return notAuthorized('not authorized');
  }

  if (!bearer.startsWith('Bearer ')) {
    return notAuthorized('token is not valid');
  }

  const [, token] = bearer.split('Bearer ');
  if (!token) {
    return notAuthorized('token is not valid');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    res.locals.user = user;
    next();
  } catch (err) {
    return notAuthorized('token is not valid');
  }
  function notAuthorized(message: string) {
    res.status(401);
    res.json({ message });
  }
};
