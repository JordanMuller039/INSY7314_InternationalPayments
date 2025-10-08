const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// @desc    Create international payment
// @route   POST /api/payments/international
// @access  Private
const createInternationalPayment = async (req, res) => {
  try {
    const {
      fromAccount,
      recipientName,
      recipientAccount,
      recipientBank,
      amount,
      currency,
      swiftCode,
      reference,
      description
    } = req.body;

    // Verify sender account
    const senderAccount = await Account.findOne({
      accountNumber: fromAccount,
      userId: req.user._id,
      isActive: true
    });

    if (!senderAccount) {
      return res.status(404).json({ error: 'Sender account not found' });
    }

    // Check sufficient funds
    const totalAmount = parseFloat(amount);
    if (!senderAccount.hasSufficientFunds(totalAmount)) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Create transaction record
    const transaction = new Transaction({
      transactionId: Transaction.generateTransactionId(),
      type: 'payment',
      status: 'pending',
      fromAccount,
      toAccount: recipientAccount,
      amount: totalAmount,
      currency,
      description,
      reference,
      userId: req.user._id,
      recipientName,
      recipientBank,
      swiftCode
    });

    await transaction.save();

    // Deduct amount from sender account (hold funds)
    await senderAccount.updateBalance(totalAmount, 'subtract');

    res.status(201).json({
      message: 'International payment request submitted successfully',
      transaction: {
        transactionId: transaction.transactionId,
        amount: transaction.amount,
        currency: transaction.currency,
        recipientName: transaction.recipientName,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    });

  } catch (error) {
    console.error('International payment error:', error);
    
    if (error.message === 'Insufficient funds') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Server error processing payment' });
  }
};

// @desc    Get payment history
// @route   GET /api/payments
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, currency } = req.query;

    // Build query for user's payments
    const query = {
      userId: req.user._id,
      type: 'payment'
    };

    if (status) query.status = status;
    if (currency) query.currency = currency;

    const payments = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('processedBy', 'firstName lastName role');

    const total = await Transaction.countDocuments(query);

    res.json({
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Get specific payment details
// @route   GET /api/payments/:transactionId
// @access  Private
const getPaymentDetails = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await Transaction.findOne({
      transactionId,
      userId: req.user._id,
      type: 'payment'
    }).populate('processedBy', 'firstName lastName role');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ payment });

  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Cancel pending payment
// @route   DELETE /api/payments/:transactionId
// @access  Private
const cancelPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const payment = await Transaction.findOne({
      transactionId,
      userId: req.user._id,
      type: 'payment'
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (!payment.canBeCancelled()) {
      return res.status(400).json({
        error: 'Payment cannot be cancelled in current status'
      });
    }

    // Refund the amount to sender account
    const senderAccount = await Account.findOne({
      accountNumber: payment.fromAccount,
      isActive: true
    });

    if (senderAccount) {
      await senderAccount.updateBalance(payment.amount, 'add');
    }

    // Update payment status
    await payment.updateStatus('cancelled', req.user._id);

    res.json({ message: 'Payment cancelled successfully' });

  } catch (error) {
    console.error('Cancel payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Process payment (Admin/Employee only)
// @route   PUT /api/payments/:transactionId/process
// @access  Private (Admin/Employee)
const processPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    const payment = await Transaction.findOne({
      transactionId,
      type: 'payment'
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        error: 'Payment is not in pending status'
      });
    }

    if (action === 'approve') {
      await payment.updateStatus('completed', req.user._id);
      res.json({ message: 'Payment approved and processed successfully' });
    } else if (action === 'reject') {
      // Refund amount to sender
      const senderAccount = await Account.findOne({
        accountNumber: payment.fromAccount,
        isActive: true
      });

      if (senderAccount) {
        await senderAccount.updateBalance(payment.amount, 'add');
      }

      await payment.updateStatus('failed', req.user._id, reason);
      res.json({ message: 'Payment rejected successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createInternationalPayment,
  getPaymentHistory,
  getPaymentDetails,
  cancelPayment,
  processPayment
};
