import BaseController from '../core/BaseController.js';
import Order from '../models/Order.js';

export default new BaseController(
  Order,
  ['customer', 'products.product'] // populate relation + sub-relation
);
