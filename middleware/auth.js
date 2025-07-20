import jwt from 'jsonwebtoken';
import { secret } from '../config/env.js';

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
};
// middleware to restrict unapproved hospitals
export const checkHospitalApproval = (req, res, next) => {
  if (req.user.role === 'hospital' && !req.user.isApproved) {
    return res.status(403).json({
      message: 'Your hospital account has not been approved yet. Please contact our team for more information.'
    });
  }
  next();
};