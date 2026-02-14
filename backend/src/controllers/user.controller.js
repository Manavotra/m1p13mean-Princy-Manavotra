// controllers/user.controller.js
import BaseController from '../core/BaseController.js';
import User from '../models/User.js';

class UserController extends BaseController {
  constructor() {
    super(User);
  }

  // 🔥 Override de create
  async create(req, res) {
    if (!req.body.email) {
      return res.status(400).json({ message: 'Email obligatoire' });
    }
    return super.create(req, res); // ✅ fonctionne maintenant
  }
}

export default new UserController();
