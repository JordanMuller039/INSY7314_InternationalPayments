const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// @desc    Get user accounts
// @route   GET /api/accounts
// @access  Private
const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ 
      userId: req.user._id,
      isActive: true 
    });

    res.json({ accounts });
  } catch (error) {
    console.error('Get accounts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get specific account details
// @route   GET /api/accounts/:accountNumber
// @access  Private
const getAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await Account.findOne({
      accountNumber,
      userId: req.user._id,
      isActive: true
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ account });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get account balance
// @route   GET /api/accounts/:accountNumber/balance
// @access  Private
const getBalance = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await Account.findOne({
      accountNumber,
      userId: req.user._id,
      isActive: true
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ 
      accountNumber: account.accountNumber,
      balance: account.balance,
      currency: account.currency 
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get account transactions
// @route   GET /api/accounts/:accountNumber/transactions
// @access  Private
const getAccountTransactions = async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { page = 1, limit = 10, status, type } = req.query;

    // Verify account ownership
    const account = await Account.findOne({
      accountNumber,
      userId: req.user._id,
      isActive: true
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Build query
    const query = {
      $or: [
        { fromAccount: accountNumber },
        { toAccount: accountNumber }
      ]
    };

    if (status) query.status = status;
    if (type) query.type = type;

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
    console.error('Get account transactions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
const createAccount = async (req, res) => {
  try {
    const { accountType, currency = 'USD' } = req.body;

    // Generate unique account number
    let accountNumber;
    let isUnique = false;
    
    while (!isUnique) {
      accountNumber = Account.generateAccountNumber();
      const existing = await Account.findOne({ accountNumber });
      if (!existing) isUnique = true;
    }

    const account = new Account({
      accountNumber,
      accountType,
      userId: req.user._id,
      currency
    });

    await account.save();

    res.status(201).json({
      message: 'Account created successfully',
      account
    });

  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Deactivate account
// @route   DELETE /api/accounts/:accountNumber
// @access  Private
const deactivateAccount = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    const account = await Account.findOne({
      accountNumber,
      userId: req.user._id
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Check if account has balance
    if (account.balance > 0) {
      return res.status(400).json({
        error: 'Cannot deactivate account with remaining balance'
      });
    }

    account.isActive = false;
    await account.save();

    res.json({ message: 'Account deactivated successfully' });

  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAccounts,
  getAccount,
  getBalance,
  getAccountTransactions,
  createAccount,
  deactivateAccount
};
