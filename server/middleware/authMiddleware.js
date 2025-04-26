import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';

export const protect = async (req, res, next) => {
  let token;
  
  // Check for token in cookies
  if (req.cookies.token) {
    try {
      // Get token from cookie
      token = req.cookies.token;

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const isMentor = async (req, res, next) => {
  if (req.user && (req.user.role === 'mentor' || req.user.role === 'both')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized. Only mentors can perform this action.' });
  }
};

export const admin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized. Only admins can perform this action.' });
  }
};
