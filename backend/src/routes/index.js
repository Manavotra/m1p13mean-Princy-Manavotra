// backend/src/routes/index.js
import express from 'express';
import userController from '../controllers/user.controller.js';
import productController from '../controllers/product.controller.js';
import categoryController from '../controllers/category.controller.js';
import subCategoryController from '../controllers/subcategory.controller.js';


import projectController from '../controllers/project.controller.js';
import invoiceController from '../controllers/invoice.controller.js';
import authorController from '../controllers/author.controller.js';
import bookController from '../controllers/book.controller.js';
import warehouseController from '../controllers/warehouse.controller.js';
import taskController from '../controllers/task.controller.js';


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


// ========================
// COMPLEX CASES
// ========================

// 1️⃣ Project (tableaux + enum)
router.get('/projects', projectController.getAll);
router.post('/projects', projectController.create);
router.put('/projects/:id', projectController.update);
router.delete('/projects/:id', projectController.delete);

// 2️⃣ Invoice (sous-documents)
router.get('/invoices', invoiceController.getAll);
router.post('/invoices', invoiceController.create);
router.put('/invoices/:id', invoiceController.update);
router.delete('/invoices/:id', invoiceController.delete);

// 3️⃣ Author / Book (relations)
router.get('/authors', authorController.getAll);
router.post('/authors', authorController.create);
router.put('/authors/:id', authorController.update);
router.delete('/authors/:id', authorController.delete);

router.get('/books', bookController.getAll);
router.post('/books', bookController.create);
router.put('/books/:id', bookController.update);
router.delete('/books/:id', bookController.delete);

// 4️⃣ Warehouse (imbrication profonde)
router.get('/warehouses', warehouseController.getAll);
router.post('/warehouses', warehouseController.create);
router.put('/warehouses/:id', warehouseController.update);
router.delete('/warehouses/:id', warehouseController.delete);

// 5️⃣ Task (enum + relation user)
router.get('/tasks', taskController.getAll);
router.post('/tasks', taskController.create);
router.put('/tasks/:id', taskController.update);
router.delete('/tasks/:id', taskController.delete);


export default router;
