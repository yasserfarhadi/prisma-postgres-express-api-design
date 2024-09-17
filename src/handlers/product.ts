import prisma from '../db';
import type { RequestHandler } from 'express';
import { ErrorMessage } from '../modules/error';

export const getProducts: RequestHandler = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: res.locals.user.id },
    include: { products: true },
  });

  if (!user) {
    res.status(400);
    res.json({ message: 'User not found' });
    return;
  }

  res.json({ data: user.products });
};

export const getProductById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(404);
    res.json({ message: 'No product id provided' });
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id, belogsToId: res.locals.user.id },
  });

  if (!product) {
    res.status(404);
    res.json({ message: 'Product not found' });
    return;
  }

  res.json({ data: product });
};

export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name as string,
        belogsToId: res.locals.user.id,
      },
    });

    res.json({ data: product });
  } catch (err) {
    next(new ErrorMessage('db', 'databse error', 500));
  }
};

export const updateProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const updated = await prisma.product.update({
    where: { id, belogsToId: res.locals.user.id },
    data: {
      name,
    },
  });
  res.json({ data: updated });
};

export const deleteProduct: RequestHandler = async (req, res) => {
  const { id } = req.params;
  console.log(id, res.locals.user.id);
  const deleted = await prisma.product.delete({
    where: {
      id,
      belogsToId: res.locals.user.id,
    },
  });

  res.json({ data: deleted });
};
