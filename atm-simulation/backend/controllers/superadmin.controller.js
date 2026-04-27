const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

// Dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalAdmins, totalAccounts, transactions] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'admin' }),
      Account.countDocuments(),
      Transaction.find().sort({ createdAt: -1 }).limit(10).populate('userId', 'name email')
    ]);
    const totalBalance = await Account.aggregate([{ $group: { _id: null, total: { $sum: '$balance' } } }]);
    const totalTxn = await Transaction.countDocuments();
    res.json({
      success: true,
      stats: {
        totalUsers, totalAdmins, totalAccounts,
        totalBalance: totalBalance[0]?.total || 0,
        totalTransactions: totalTxn
      },
      recentTransactions: transactions
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).sort({ createdAt: -1 });
    res.json({ success: true, admins });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Create admin
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    const admin = await User.create({ name, email, password, phone, role: 'admin', createdBy: req.user._id });
    res.status(201).json({ success: true, admin });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Toggle admin status
exports.toggleAdminStatus = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: 'admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    admin.isActive = !admin.isActive;
    await admin.save({ validateBeforeSave: false });
    res.json({ success: true, message: `Admin ${admin.isActive ? 'activated' : 'deactivated'}`, admin });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id, role: 'admin' });
    res.json({ success: true, message: 'Admin deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all accounts
exports.getAllAccounts = async (req, res) => {
  try {
    const accounts = await Account.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, accounts });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('userId', 'name email')
      .populate('accountId', 'accountNumber')
      .sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
