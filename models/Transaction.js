const mongoose = require('mongoose');

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

// Generate unique transaction ID
transactionSchema.statics.generateTransactionId = function() {
  const prefix = 'TXN';
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Update status method
transactionSchema.methods.updateStatus = function(status, processedBy = null, failureReason = null) {
  this.status = status;
  this.processedAt = new Date();
  if (processedBy) this.processedBy = processedBy;
  if (failureReason) this.failureReason = failureReason;
  return this.save();
};

// Check if transaction can be cancelled
transactionSchema.methods.canBeCancelled = function() {
  return ['pending', 'processing'].includes(this.status);
};

module.exports = mongoose.model('Transaction', transactionSchema);
