// backend/src/routes/index.js
import express from 'express';
import userController from '../controllers/user.controller.js';
import productController from '../controllers/product.controller.js';
import categoryController from '../controllers/category.controller.js';
import subCategoryController from '../controllers/subcategory.controller.js';

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


// Category
router.get('/category', categoryController.getAll);
router.get('/category/:id', categoryController.getById);
router.post('/category', categoryController.create);
router.put('/category/:id', categoryController.update);
router.delete('/category/:id', categoryController.delete);

// SubCategory
router.get('/subcategory', subCategoryController.getAll);
router.get('/subcategory/:id', subCategoryController.getById);
router.post('/subcategory', subCategoryController.create);
router.put('/subcategory/:id', subCategoryController.update);
router.delete('/subcategory/:id', subCategoryController.delete);


export default router;
