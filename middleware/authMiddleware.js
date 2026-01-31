const authMiddleware = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    if (userRole === 'admin' || userRole === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: "Akses ditolak!" });
    }
  };
};

module.exports = authMiddleware;