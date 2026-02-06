// backend/src/routes/index.js
import express from 'express';
import userController from '../controllers/user.controller.js';
import productController from '../controllers/product.controller.js';

const router = express.Router();

// Users
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getOne);
router.post('/users', userController.create);
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);

// Products
router.get('/products', productController.getAll);
router.get('/products/:id', productController.getOne);
router.post('/products', productController.create);
router.put('/products/:id', productController.update);
router.delete('/products/:id', productController.delete);

export default router;
