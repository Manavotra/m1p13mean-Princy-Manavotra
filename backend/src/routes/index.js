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
router.get('/users/:id', userController.getOne);

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
router.get('/shop', shopController.getAll);
router.get('/shop/:id', shopController.getOne);

// Upload single logo
router.post(
  '/shop',
  upload.single('logo'),
  shopController.create
);

router.put(
  '/shop/:id',
  upload.single('logo'),
  shopController.update
);

router.delete('/shop/:id', shopController.delete);


// Category
router.get('/category', categoryController.getAll);
router.get('/category/:id', categoryController.getById);
router.post('/category', categoryController.create);
router.put('/category/:id', categoryController.update);
router.delete('/category/:id', categoryController.delete);





// Products
router.get('/products', productController.getAll);
router.get('/products/:id', productController.getOne);
// Upload single image
router.post(
  '/users',
  upload.single('image'),
  userController.create
);

router.put(
  '/users/:id',
  upload.single('image'),
  userController.update
);
router.delete('/products/:id', productController.delete);



// Discount
router.get('/discount', discountController.getAll);
router.get('/discount/:id', discountController.getById);
router.post('/discount', discountController.create);
router.put('/discount/:id', discountController.update);
router.delete('/discount/:id', discountController.delete);



// Cart
router.get('/cart', cartController.getAll);
router.get('/cart/:id', cartController.getById);
router.post('/cart', cartController.create);
router.put('/cart/:id', cartController.update);
router.delete('/cart/:id', cartController.delete);

// Orders
router.get('/orders', orderController.getAll);
router.post('/orders', orderController.create);
router.put('/orders/:id', orderController.update);
router.delete('/orders/:id', orderController.delete);




// Favorite
router.get('/favorite', favoriteController.getAll);
router.post('/favorite', favoriteController.create);
router.put('/favorite/:id', favoriteController.update);
router.delete('/favorite/:id', favoriteController.delete);


export default router;
