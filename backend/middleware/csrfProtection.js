/**
 * CSRF Protection Middleware
 * Validates CSRF tokens for state-changing operations
 * Protects against Cross-Site Request Forgery attacks
 */

const crypto = require('crypto');

const csrfTokens = new Map();

const generateToken = (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(userId, token);
  
  setTimeout(() => csrfTokens.delete(userId), 3600000);
  
  return token;
};

const validateToken = (userId, token) => {
  const storedToken = csrfTokens.get(userId);
  return storedToken && storedToken === token;
};

const csrfProtection = (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    const token = req.headers['x-csrf-token'];
    
    if (!token || !validateToken(req.user?._id?.toString(), token)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  
  next();
};

module.exports = { generateToken, validateToken, csrfProtection };