const express = require('express');
const rateLimit = require('express-rate-limit');
const { auth, authorize } = require('../middleware/auth');
const { validateInput, validationRules } = require('../middleware/validation');
const {
  createInternationalPayment,
  getPaymentHistory,
  getPaymentDetails,
  cancelPayment,
  processPayment
} = require('../controllers/paymentController');

const router = express.Router();

// Rate limiting for payment endpoints
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 payment requests per windowMs
  message: {
    error: 'Too many payment requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// All routes require authentication
router.use(auth);

// @route   POST /api/payments/international
// @desc    Create international payment
// @access  Private
router.post('/international', 
  paymentLimiter,
  validateInput(validationRules.payment),
  createInternationalPayment
);

// @route   GET /api/payments
// @desc    Get payment history
// @access  Private
router.get('/', getPaymentHistory);

// @route   GET /api/payments/:transactionId
// @desc    Get specific payment details
// @access  Private
router.get('/:transactionId', getPaymentDetails);

// @route   DELETE /api/payments/:transactionId
// @desc    Cancel pending payment
// @access  Private
router.delete('/:transactionId', cancelPayment);

// @route   PUT /api/payments/:transactionId/process
// @desc    Process payment (Admin/Employee only)
// @access  Private (Admin/Employee)
router.put('/:transactionId/process',
  authorize('admin', 'employee'),
  validateInput([
    require('express-validator').body('action')
      .isIn(['approve', 'reject'])
      .withMessage('Action must be either approve or reject'),
    require('express-validator').body('reason')
      .optional()
      .isLength({ min: 3, max: 200 })
      .withMessage('Reason must be between 3 and 200 characters')
  ]),
  processPayment
);

module.exports = router;
