const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { getCustomers, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

// GET /api/users/customers - accessible to employees and admins
router.get('/customers', auth, authorize('employee', 'admin'), getCustomers);

// GET /api/users - admin-only: list all users
router.get('/', auth, authorize('admin'), getAllUsers);

// PUT /api/users/:id - admin updates user
router.put('/:id', auth, authorize('admin'), updateUser);

// DELETE /api/users/:id - admin deletes user
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
