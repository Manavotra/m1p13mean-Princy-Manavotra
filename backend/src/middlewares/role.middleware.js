export const authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.session.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.session.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};