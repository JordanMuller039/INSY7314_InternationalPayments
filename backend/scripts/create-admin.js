/**
 * Admin User Creation Script
 * Creates initial admin user for employee portal management
 * Run once during setup: node scripts/create-admin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Account = require('../models/Account');

async function createAdmin() {
  try {
    await mongoose.connect(process.env.ATLAS_DB_PATH);
    console.log('📦 Connected to MongoDB');

    const adminEmail = 'admin@turtleshell.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      process.exit(0);
    }

    const adminUser = new User({
      firstName: 'System',
      lastName: 'Administrator',
      email: adminEmail,
      password: 'Admin123!@#',
      idNumber: 'ADMIN001',
      accountNumber: '9999999999',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();

    const adminAccount = new Account({
      accountNumber: '9999999999',
      accountType: 'checking',
      userId: adminUser._id,
      currency: 'USD',
      balance: 0
    });

    await adminAccount.save();

    console.log('✅ Admin user created successfully');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password: Admin123!@#');
    console.log('⚠️  CHANGE PASSWORD IMMEDIATELY AFTER FIRST LOGIN');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();