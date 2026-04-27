const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, activeAccounts, totalTxn] = await Promise.all([
      User.countDocuments({ role: 'user', createdBy: req.user._id }),
      Account.countDocuments({ isActive: true }),
      Transaction.countDocuments()
    ]);
    const recentTxn = await Transaction.find()
      .populate('userId', 'name email')
      .populate('accountId', 'accountNumber')
      .sort({ createdAt: -1 }).limit(8);
    const totalDeposits = await Transaction.aggregate([
      { $match: { type: 'deposit', status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdrawals = await Transaction.aggregate([
      { $match: { type: 'withdrawal', status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({
      success: true,
      stats: {
        totalUsers, activeAccounts, totalTransactions: totalTxn,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalWithdrawals: totalWithdrawals[0]?.total || 0
      },
      recentTransactions: recentTxn
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, phone, role: 'user', createdBy: req.user._id });
    res.status(201).json({ success: true, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, role: 'user' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Create bank account for user
exports.createAccount = async (req, res) => {
  try {
    const { userId, accountType, initialBalance, pin, dailyLimit } = req.body;
    const user = await User.findOne({ _id: userId, role: 'user' });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const accNum = '4' + Date.now().toString().slice(-9) + Math.floor(Math.random() * 10);
    const hashedPin = await bcrypt.hash(String(pin), 10);

    const account = await Account.create({
      userId, accountNumber: accNum, accountType,
      balance: initialBalance || 0,
      pin: hashedPin,
      dailyLimit: dailyLimit || 20000
    });

    if (initialBalance > 0) {
      await Transaction.create({
        accountId: account._id, userId,
        type: 'deposit', amount: initialBalance,
        balanceBefore: 0, balanceAfter: initialBalance,
        description: 'Initial deposit on account creation'
      });
    }
    res.status(201).json({ success: true, account });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, accounts });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Toggle account status
exports.toggleAccountStatus = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: 'Account not found' });
    account.isActive = !account.isActive;
    await account.save();
    res.json({ success: true, message: `Account ${account.isActive ? 'activated' : 'blocked'}`, account });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Update daily limit
exports.updateDailyLimit = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(
      req.params.id, { dailyLimit: req.body.dailyLimit }, { new: true }
    );
    res.json({ success: true, account });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .populate('accountId', 'accountNumber accountType')
      .sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
