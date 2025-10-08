const express = require('express');
const { auth } = require('../middleware/auth');
const { validateInput, validationRules } = require('../middleware/validation');
const {
  getAccounts,
  getAccount,
  getBalance,
  getAccountTransactions,
  createAccount,
  deactivateAccount
} = require('../controllers/accountController');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/accounts
// @desc    Get user accounts
// @access  Private
router.get('/', getAccounts);

// @route   POST /api/accounts
// @desc    Create new account
// @access  Private
router.post('/', 
  validateInput(validationRules.account),
  createAccount
);

// @route   GET /api/accounts/:accountNumber
// @desc    Get specific account details
// @access  Private
router.get('/:accountNumber', getAccount);

// @route   GET /api/accounts/:accountNumber/balance
// @desc    Get account balance
// @access  Private
router.get('/:accountNumber/balance', getBalance);

// @route   GET /api/accounts/:accountNumber/transactions
// @desc    Get account transactions
// @access  Private
router.get('/:accountNumber/transactions', getAccountTransactions);

// @route   DELETE /api/accounts/:accountNumber
// @desc    Deactivate account
// @access  Private
router.delete('/:accountNumber', deactivateAccount);

module.exports = router;
