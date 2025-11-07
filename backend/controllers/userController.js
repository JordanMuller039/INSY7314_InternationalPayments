const User = require('../models/User');
const Account = require('../models/Account');

// @desc    Get all customers (non-sensitive fields)
// @route   GET /api/users/customers
// @access  Employee/Admin
const getCustomers = async (req, res) => {
  try {
    // Return customers only, exclude password and Mongo internals
    const customers = await User.find({ role: 'customer' })
      .select('firstName lastName email idNumber accountNumber role isActive isVerified lastLogin createdAt');

    res.json({ customers });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('firstName lastName email idNumber accountNumber role isActive isVerified lastLogin createdAt');
    res.json({ users });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// @desc    Update a user (admin)
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body || {};

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Allowed updates
    const allowed = ['firstName', 'lastName', 'email', 'idNumber', 'accountNumber', 'role', 'isActive', 'isVerified', 'password'];
    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        user[field] = updates[field];
      }
    });

    await user.save();

    res.json({ message: 'User updated', user: user.toJSON() });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// @desc    Delete a user and their accounts (admin)
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Delete associated accounts
    await Account.deleteMany({ userId: user._id });
    await user.remove();

    res.json({ message: 'User and associated accounts deleted' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getCustomers,
  getAllUsers,
  updateUser,
  deleteUser,
};
