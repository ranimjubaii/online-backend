const admin = (req, res, next) => {
  if (req.user && req.user.user_type === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Management administrative access required' });
  }
};

export { admin };