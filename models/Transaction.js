const mongoose = require('mongoose');

// Transaction Model - Francois Smit Banking System Implementation
// Handles all payment transactions including international transfers
const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer', 'payment', 'fee'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  fromAccount: {
    type: String,
    required: function() {
      return ['withdrawal', 'transfer', 'payment'].includes(this.type);
    }
  },
  toAccount: {
    type: String,
    required: function() {
      return ['deposit', 'transfer', 'payment'].includes(this.type);
    }
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    required: true,
    default: 'USD'
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  reference: {
    type: String,
    trim: true,
    maxlength: 50
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // For international payments
  recipientName: {
    type: String,
    trim: true
  },
  recipientBank: {
    type: String,
    trim: true
  },
  swiftCode: {
    type: String,
    trim: true
  },
  // Processing details
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  failureReason: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Transaction ID Generator - Creates unique identifiers for banking transactions
// Format: TXN + timestamp + random string for guaranteed uniqueness
transactionSchema.statics.generateTransactionId = function() {
  const prefix = 'TXN';
  const timestamp = Date.now().toString(); // Ensures chronological ordering
  const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char random suffix
  return `${prefix}${timestamp}${random}`;
};

// Transaction Status Management - Updates payment processing status
transactionSchema.methods.updateStatus = function(status, processedBy = null, failureReason = null) {
  this.status = status; // pending -> processing -> completed/failed
  this.processedAt = new Date(); // Timestamp for audit trail
  if (processedBy) this.processedBy = processedBy; // Track who processed transaction
  if (failureReason) this.failureReason = failureReason; // Store failure details for support
  return this.save();
};

// Business Logic: Transaction Cancellation Rules
// Only allow cancellation of transactions that haven't been finalized
transactionSchema.methods.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.status); // Completed/failed transactions cannot be cancelled
};

module.exports = mongoose.model('Transaction', transactionSchema);
