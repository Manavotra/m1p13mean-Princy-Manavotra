// backend/src/routes/index.js
import express from 'express';
import userController from '../controllers/user.controller.js';
import shopController from '../controllers/shop.controller.js';
import categoryController from '../controllers/category.controller.js';
import productController from '../controllers/product.controller.js';
import discountController from '../controllers/discount.controller.js';
import cartController from '../controllers/cart.controller.js';
import orderController from '../controllers/order.controller.js';

import favoriteController from '../controllers/favorite.controller.js';


import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

// Users
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById);

// Upload single avatar
router.post(
  '/users',
  upload.single('avatar'),
  userController.create
);

router.put(
  '/users/:id',
  upload.single('avatar'),
  userController.update
);

router.delete('/users/:id', userController.delete);


// Shop
router.get('/shops', shopController.getAll);
router.get('/shops/:id', shopController.getById);

// Upload single logo
router.post(
  '/shops',
  upload.single('logo'),
  shopController.create
);

router.put(
  '/shops/:id',
  upload.single('logo'),
  shopController.update
);

router.delete('/shops/:id', shopController.delete);


// Category
router.get('/categories', categoryController.getAll);
router.get('/categories/:id', categoryController.getById);
router.post('/categories', categoryController.create);
router.put('/categories/:id', categoryController.update);
router.delete('/categories/:id', categoryController.delete);





// Products
router.get('/products', productController.getAll);
router.get('/products/:id', productController.getById);
// Upload single image
router.post(
  '/products',
  upload.single('image'),
  productController.create
);

router.put(
  '/products/:id',
  upload.single('image'),
  productController.update
);
router.delete('/products/:id', productController.delete);



// Discount
router.get('/discounts', discountController.getAll);
router.get('/discounts/:id', discountController.getById);
router.post('/discounts', discountController.create);
router.put('/discounts/:id', discountController.update);
router.delete('/discounts/:id', discountController.delete);



// Cart
router.get('/carts', cartController.getAll);
router.get('/carts/:id', cartController.getById);
router.post('/carts', cartController.create);
router.put('/carts/:id', cartController.update);
router.delete('/carts/:id', cartController.delete);

// Orders
router.get('/orders', orderController.getAll);
router.get('/orders/:id', orderController.getById);
router.post('/orders', orderController.create);
router.put('/orders/:id', orderController.update);
router.delete('/orders/:id', orderController.delete);




// Favorite
router.get('/favorites', favoriteController.getAll);
router.post('/favorites', favoriteController.create);
router.put('/favorites/:id', favoriteController.update);
router.delete('/favorites/:id', favoriteController.delete);


export default router;
