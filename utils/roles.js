export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: 'Access denied:  you do not have permissions to perform this action' });
    }
    next();
  };
};
