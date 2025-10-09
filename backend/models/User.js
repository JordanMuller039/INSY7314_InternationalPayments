const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Model Schema - Francois Smit Banking Security Implementation
// Defines user data structure with validation and password security
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  idNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'employee', 'admin'],
    default: 'customer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
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

// CRITICAL SECURITY: Password hashing middleware
// Runs before saving user to database - hashes password for secure storage
userSchema.pre('save', async function(next) {
  // Only hash if password was modified (prevents re-hashing on user updates)
  if (!this.isModified('password')) return next();
  
  try {
    // Use 12 salt rounds for banking-grade security (takes ~300ms to hash)
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// Password verification method for login authentication
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Uses bcrypt's secure comparison to verify password against hash
  return bcrypt.compare(candidatePassword, this.password);
};

// Security measure: Never expose password hashes in API responses
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password; // Remove sensitive password hash from output
  return userObject;
};

// Update lastLogin
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
