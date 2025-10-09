const { body, validationResult } = require('express-validator');
const patterns = require('../utils/regex');

// Input validation middleware
const validateInput = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }
    next();
  };
};

// Common validation rules
const validationRules = {
  // User registration validation
  register: [
    body('firstName')
      .matches(patterns.name)
      .withMessage('First name must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)'),
    body('lastName')
      .matches(patterns.name)
      .withMessage('Last name must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)'),
    body('email')
      .matches(patterns.email)
      .withMessage('Please provide a valid email address'),
    body('idNumber')
      .matches(patterns.idNumber)
      .withMessage('ID number must be 5-20 alphanumeric characters'),
    body('accountNumber')
      .matches(patterns.accountNumber)
      .withMessage('Account number must be 8-20 digits'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  ],

  // Login validation
  login: [
    body('email')
      .matches(patterns.email)
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Payment validation
  payment: [
    body('recipientName')
      .matches(patterns.name)
      .withMessage('Recipient name must contain only letters, spaces, hyphens, and apostrophes (2-50 characters)'),
    body('recipientAccount')
      .matches(patterns.accountNumber)
      .withMessage('Recipient account must be 8-20 digits'),
    body('amount')
      .matches(patterns.amount)
      .withMessage('Amount must be a valid number with up to 2 decimal places'),
    body('currency')
      .matches(patterns.currency)
      .withMessage('Currency must be a valid 3-letter ISO code'),
    body('swiftCode')
      .matches(patterns.swiftCode)
      .withMessage('SWIFT code must be 8 or 11 characters (format: AAAABBCCXXX)'),
    body('reference')
      .optional()
      .matches(patterns.reference)
      .withMessage('Reference must be 3-50 alphanumeric characters with hyphens/underscores')
  ],

  // Account creation validation
  account: [
    body('accountType')
      .isIn(['checking', 'savings', 'business'])
      .withMessage('Account type must be checking, savings, or business'),
    body('currency')
      .matches(patterns.currency)
      .withMessage('Currency must be a valid 3-letter ISO code')
  ]
};

module.exports = {
  validateInput,
  validationRules
};
