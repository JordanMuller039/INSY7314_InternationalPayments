const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Account = require('../models/Account');

// JWT Token Generator - Francois Smit INSY7314 Banking Security Implementation
// Critical security function: Creates signed tokens for user authentication
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h' // 24h expiry balances security vs usability
  });
};

// Updated to give roles
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, idNumber, accountNumber } = req.body;

    // Normalize inputs for reliable duplicate checks
    const emailNorm = email ? String(email).toLowerCase().trim() : undefined;
    const idNumberNorm = idNumber ? String(idNumber).trim() : undefined;
    const accountNumberNorm = accountNumber ? String(accountNumber).trim() : undefined;

    // Build OR query only for provided values to avoid accidental matches
    const orConditions = [];
    if (emailNorm) orConditions.push({ email: emailNorm });
    if (idNumberNorm) orConditions.push({ idNumber: idNumberNorm });

    // Debug log to help trace unexpected duplicate detections
    console.log('Register attempt:', { email: emailNorm, idNumber: idNumberNorm, accountNumber: accountNumberNorm });

    let existingUser = null;
    if (orConditions.length > 0) {
      existingUser = await User.findOne({ $or: orConditions });
      console.log('Existing user found during registration check:', existingUser ? existingUser._id : null);
    }

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or ID number already exists'
      });
    }

    const role = req.path.includes('register-employee') ? 'employee' : 'customer';

    const user = new User({
      firstName,
      lastName,
      email: emailNorm,
      password,
      idNumber: idNumberNorm,
      accountNumber: accountNumberNorm,
      role,
      isVerified: true
    });

    await user.save();

    const account = new Account({
      accountNumber: accountNumberNorm,
      accountType: 'checking',
      userId: user._id,
      currency: 'USD',
      balance: role === 'employee' ? 0 : 1000
    });

    await account.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: `${role === 'employee' ? 'Employee' : 'Customer'} registered successfully`,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountNumber: user.accountNumber,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update allowed fields only
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};