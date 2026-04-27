const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB...');

  // Clear existing data
  await User.deleteMany({});
  await Account.deleteMany({});
  await Transaction.deleteMany({});

  // Create SuperAdmin
  const superadmin = await User.create({
    name: 'Super Admin',
    email: 'superadmin@atm.com',
    password: 'superadmin123',
    role: 'superadmin',
    phone: '9000000001'
  });

  // Create Admin
  const admin = await User.create({
    name: 'Bank Admin',
    email: 'admin@atm.com',
    password: 'admin123',
    role: 'admin',
    phone: '9000000002',
    createdBy: superadmin._id
  });

  // Create Users
  const user1 = await User.create({
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    password: 'user123',
    role: 'user',
    phone: '9876543210',
    createdBy: admin._id
  });

  const user2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'user123',
    role: 'user',
    phone: '9876543211',
    createdBy: admin._id
  });

  // Create Accounts
  const pin1 = await bcrypt.hash('1234', 10);
  const pin2 = await bcrypt.hash('5678', 10);

  const acc1 = await Account.create({
    userId: user1._id,
    accountNumber: '4123456789012',
    accountType: 'savings',
    balance: 50000,
    pin: pin1,
    dailyLimit: 20000
  });

  const acc2 = await Account.create({
    userId: user2._id,
    accountNumber: '4987654321098',
    accountType: 'current',
    balance: 100000,
    pin: pin2,
    dailyLimit: 50000
  });

  // Sample Transactions
  await Transaction.create([
    { accountId: acc1._id, userId: user1._id, type: 'deposit', amount: 50000, balanceBefore: 0, balanceAfter: 50000, description: 'Initial deposit' },
    { accountId: acc2._id, userId: user2._id, type: 'deposit', amount: 100000, balanceBefore: 0, balanceAfter: 100000, description: 'Initial deposit' },
    { accountId: acc1._id, userId: user1._id, type: 'withdrawal', amount: 5000, balanceBefore: 50000, balanceAfter: 45000, description: 'ATM Withdrawal' }
  ]);

  // Update balance after sample txn
  await Account.findByIdAndUpdate(acc1._id, { balance: 45000 });

  console.log('\n Seed data created successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 SuperAdmin → superadmin@atm.com / superadmin123');
  console.log('🔐 Admin      → admin@atm.com / admin123');
  console.log('🔐 User 1     → rahul@example.com / user123 | PIN: 1234');
  console.log('🔐 User 2     → priya@example.com / user123 | PIN: 5678');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
