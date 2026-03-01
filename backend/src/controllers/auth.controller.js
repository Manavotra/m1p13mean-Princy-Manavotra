import User from '../models/User.js';

class AuthController {

  // 🔐 LOGIN
// 🔐 LOGIN
  async login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔥 Stocke user en session côté serveur
    req.session.userId = user._id;
    req.session.role = user.role; 

    // 🔥 Renvoie les infos au frontend
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role // 👈 AJOUTE CETTE LIGNE ICI
      }
    });
  }

  // 🚪 LOGOUT
  logout(req, res) {
    req.session.destroy();
    res.json({ message: 'Logged out' });
  }

  // 👤 PROFIL CONNECTÉ
  async me(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await User.findById(req.session.userId).select('-password');
    res.json(user);
  }

}

export default new AuthController();