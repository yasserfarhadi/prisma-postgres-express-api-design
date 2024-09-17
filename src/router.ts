import { Router } from 'express';
import { body, oneOf, validationResult } from 'express-validator';
import { handleInputErrors } from './modules/middleware';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from './handlers/product';
import {
  createUpdate,
  deleteUpdate,
  getUpdateById,
  getUpdates,
  updateUpdate,
} from './handlers/update';

const router = Router();

// Product
router.get('/product', getProducts);
router.get('/product/:id', getProductById);
router.put(
  '/product/:id',
  body('name').isString(),
  handleInputErrors,
  updateProduct
);
router.post(
  '/product',
  body('name').isString(),
  handleInputErrors,
  createProduct
);
router.delete('/product/:id', deleteProduct);

// Updates
router.get('/update', getUpdates);
router.get('/update/:id', getUpdateById);
router.put(
  '/update/:id',

  body('title').optional(),
  body('body').optional(),
  body('status').isIn(['IN_PROGRESS', 'SHIPPED', 'DEPRECATED']).optional(),
  body('version').optional(),
  handleInputErrors,
  updateUpdate
);
router.post(
  '/update',
  body('title').exists().isString(),
  body('body').exists().isString(),
  body('productId').exists().isString(),
  handleInputErrors,
  createUpdate
);
router.delete('/update/:id', deleteUpdate);

// Update Point
router.get('/updatpoint', (req, res) => {});
router.get('/updatepoint/:id', (req, res) => {});
router.put(
  '/updatepoint/:id',
  body('name').optional().isString(),
  body('description').optional().isString(),
  handleInputErrors,
  (req, res) => {}
);
router.post(
  '/updatepoint',
  body('name').exists().isString(),
  body('description').exists().isString(),
  body('updateId').exists().isString(),
  handleInputErrors,
  (req, res) => {}
);
router.delete('/updatepoint/:id', (req, res) => {});

export default router;
