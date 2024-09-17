import prisma from '../db';
import type { RequestHandler } from 'express';

export const getUpdates: RequestHandler = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { belogsToId: res.locals.user.id },
    include: {
      updates: true,
    },
  });

  const updates = products.flatMap((product) => product.updates);

  res.json({ data: updates });
};

export const getUpdateById: RequestHandler = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(404);
    res.json({ message: 'No product id provided' });
    return;
  }

  const update = await prisma.update.findUnique({
    where: { id },
  });

  if (!update) {
    res.status(404);
    res.json({ message: 'Product not found' });
    return;
  }

  res.json({ data: update });
};

export const createUpdate: RequestHandler = async (req, res) => {
  const userData = req.body;
  const product = await prisma.product.findUnique({
    where: {
      id: userData.productId,
    },
  });

  if (!product) {
    // does not belong to user
    res.json({ message: 'Not authorized' });
    return;
  }

  const update = await prisma.update.create({
    data: userData,
  });

  res.json({ data: update });
};

export const updateUpdate: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const update = await prisma.update.findFirst({
    where: {
      id,
      product: {
        belogsToId: res.locals.user.id,
      },
    },
  });
  if (!update) {
    res.json({ message: 'nope' });
    return;
  }

  // const products = await prisma.product.findMany({
  //   where: {
  //     belogsToId: res.locals.user.id,
  //   },
  //   include: {
  //     updates: true,
  //   },
  // });

  // const updates = products.flatMap((product) => product.updates);
  // const match = updates.find((update) => update.id === req.params.id);
  // if (!match) {
  //   res.json({ message: 'nope' });
  //   return;
  // }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: update.id,
    },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
};

export const deleteUpdate: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const update = await prisma.update.findFirst({
    where: {
      id,
      product: {
        belogsToId: res.locals.user.id,
      },
    },
  });
  if (!update) {
    res.json({ message: 'nope' });
    return;
  }
  const deleted = await prisma.update.delete({
    where: {
      id,
    },
  });

  res.json({ data: deleted });
};
