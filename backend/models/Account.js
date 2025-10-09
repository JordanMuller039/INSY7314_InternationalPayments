const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accountType: {
    type: String,
    enum: ['checking', 'savings', 'business'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    length: 3
  },
  isActive: {
    type: Boolean,
    default: true
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

// Generate unique account number
accountSchema.statics.generateAccountNumber = function() {
  return Math.random().toString().slice(2, 12);
};

// Update balance method
accountSchema.methods.updateBalance = function(amount, operation = 'add') {
  if (operation === 'add') {
    this.balance += amount;
  } else if (operation === 'subtract') {
    if (this.balance < amount) {
      throw new Error('Insufficient funds');
    }
    this.balance -= amount;
  }
  return this.save();
};

// Check if account has sufficient funds
accountSchema.methods.hasSufficientFunds = function(amount) {
  return this.balance >= amount;
};

module.exports = mongoose.model('Account', accountSchema);
