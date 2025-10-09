const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();

// All routes require authentication
router.use(auth);

// @route   GET /api/transactions
// @desc    Get user transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;

    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('processedBy', 'firstName lastName role');

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/transactions/:transactionId
// @desc    Get specific transaction details
// @access  Private
const getTransactionDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({
      transactionId,
      userId: req.user._id
    }).populate('processedBy', 'firstName lastName role');

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Get transaction details error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/transactions/all
// @desc    Get all transactions (Admin only)
// @access  Private (Admin)
const getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;

    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName role');

    const total = await Transaction.countDocuments(query);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

router.get('/', getTransactions);
router.get('/all', authorize('admin'), getAllTransactions);
router.get('/:transactionId', getTransactionDetails);

module.exports = router;
