
/**
 * Authentication Routes - Employee Portal
 * Handles admin-controlled user creation and employee authentication
 * Public registration disabled for security - employees created by admins only
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { auth } = require('../middleware/auth');
const { validateInput, validationRules } = require('../middleware/validation');
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// @route   POST /api/auth/register
// @desc    Register new employee (Admin only)
// @access  Private (Admin)
router.post('/register', 
  auth,
  authorize('admin'),
  validateInput(validationRules.register),
  register
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', 
  authLimiter,
  validateInput(validationRules.login),
  login
);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', 
  auth,
  validateInput([
    require('express-validator').body('firstName')
      .optional()
      .matches(/^[a-zA-Z\s\-\']{2,50}$/)
      .withMessage('First name must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)'),
    require('express-validator').body('lastName')
      .optional()
      .matches(/^[a-zA-Z\s\-\']{2,50}$/)
      .withMessage('Last name must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)')
  ]),
  updateProfile
);

// @route   PUT /api/auth/password
// @desc    Change password
// @access  Private
router.put('/password', 
  auth,
  validateInput([
    require('express-validator').body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    require('express-validator').body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  ]),
  changePassword
);

module.exports = router;
