const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check role and assign user/admin to request
      if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
        req.role = 'admin';
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        req.role = req.user?.role || 'user'; // support staff role
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, token user not found' });
      }

      next();
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied, administrator role required' });
  }
};

const staffOnly = (req, res, next) => {
  if (req.role === 'staff' || req.role === 'mechanic' || req.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied, staff role required' });
  }
};

module.exports = { protect, adminOnly, staffOnly };
