// src/controllers/user.controller.js
import BaseController from '../core/BaseController.js';
import User from '../models/User.js';

const userController = new BaseController(User);
export default userController;
