const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication Middleware - Francois Smit Security Implementation
// Protects banking routes by validating JWT tokens
const auth = async (req, res, next) => {
  try {
    // Extract Bearer token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: 'Access denied. Banking operations require authentication.' 
      });
    }

    try {
      // Verify token signature and expiry using secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid token. User account not found.' 
        });
      }

      // Add authenticated user to request object for controllers
      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        error: 'Token is not valid.' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Server error in authentication' });
  }
};

// Role-based access control middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

module.exports = { auth, authorize };
