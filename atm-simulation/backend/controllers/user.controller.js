const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcryptjs');

// Get my accounts
exports.getMyAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id, isActive: true });
    res.json({ success: true, accounts });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Verify PIN and get account
exports.verifyPin = async (req, res) => {
  try {
    const { accountId, pin } = req.body;
    const account = await Account.findOne({ _id: accountId, userId: req.user._id, isActive: true });
    if (!account) return res.status(404).json({ message: 'Account not found or inactive' });
    const isValid = await bcrypt.compare(String(pin), account.pin);
    if (!isValid) return res.status(400).json({ message: 'Invalid PIN' });
    res.json({ success: true, message: 'PIN verified', account });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Check balance
exports.checkBalance = async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.accountId, userId: req.user._id, isActive: true });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    // Log balance inquiry
    await Transaction.create({
      accountId: account._id, userId: req.user._id,
      type: 'balance_inquiry', amount: 0,
      balanceBefore: account.balance, balanceAfter: account.balance,
      description: 'Balance inquiry'
    });
    res.json({ success: true, balance: account.balance, accountNumber: account.accountNumber });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Withdraw
exports.withdraw = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    if (amount % 100 !== 0) return res.status(400).json({ message: 'Amount must be in multiples of ₹100' });

    const account = await Account.findOne({ _id: accountId, userId: req.user._id, isActive: true });
    if (!account) return res.status(404).json({ message: 'Account not found or inactive' });

    account.resetDailyIfNeeded();

    if (account.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    if (account.withdrawnToday + amount > account.dailyLimit) {
      return res.status(400).json({ message: `Daily limit exceeded. Remaining: ₹${account.dailyLimit - account.withdrawnToday}` });
    }

    const balanceBefore = account.balance;
    account.balance -= amount;
    account.withdrawnToday += amount;
    await account.save();

    const txn = await Transaction.create({
      accountId: account._id, userId: req.user._id,
      type: 'withdrawal', amount,
      balanceBefore, balanceAfter: account.balance,
      description: 'ATM Withdrawal'
    });
    res.json({ success: true, message: `₹${amount} withdrawn successfully`, transaction: txn, newBalance: account.balance });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Deposit
exports.deposit = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const account = await Account.findOne({ _id: accountId, userId: req.user._id, isActive: true });
    if (!account) return res.status(404).json({ message: 'Account not found or inactive' });

    const balanceBefore = account.balance;
    account.balance += amount;
    await account.save();

    const txn = await Transaction.create({
      accountId: account._id, userId: req.user._id,
      type: 'deposit', amount,
      balanceBefore, balanceAfter: account.balance,
      description: 'ATM Deposit'
    });
    res.json({ success: true, message: `₹${amount} deposited successfully`, transaction: txn, newBalance: account.balance });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Transfer
exports.transfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountNumber, amount, description } = req.body;
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    const fromAccount = await Account.findOne({ _id: fromAccountId, userId: req.user._id, isActive: true });
    if (!fromAccount) return res.status(404).json({ message: 'Source account not found' });

    const toAccount = await Account.findOne({ accountNumber: toAccountNumber, isActive: true });
    if (!toAccount) return res.status(404).json({ message: 'Destination account not found' });

    if (fromAccount._id.equals(toAccount._id)) return res.status(400).json({ message: 'Cannot transfer to same account' });
    if (fromAccount.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    fromAccount.resetDailyIfNeeded();
    if (fromAccount.withdrawnToday + amount > fromAccount.dailyLimit) {
      return res.status(400).json({ message: 'Daily limit exceeded' });
    }

    const fromBalBefore = fromAccount.balance;
    const toBalBefore = toAccount.balance;

    fromAccount.balance -= amount;
    fromAccount.withdrawnToday += amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    await Transaction.create({
      accountId: fromAccount._id, userId: req.user._id,
      type: 'transfer', amount,
      balanceBefore: fromBalBefore, balanceAfter: fromAccount.balance,
      toAccount: toAccountNumber,
      description: description || 'Fund Transfer'
    });
    await Transaction.create({
      accountId: toAccount._id, userId: toAccount.userId,
      type: 'deposit', amount,
      balanceBefore: toBalBefore, balanceAfter: toAccount.balance,
      description: `Transfer from ${fromAccount.accountNumber}`
    });

    res.json({ success: true, message: `₹${amount} transferred to ${toAccountNumber}`, newBalance: fromAccount.balance });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Transaction history
exports.getTransactions = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id });
    const accountIds = accounts.map(a => a._id);
    const transactions = await Transaction.find({ accountId: { $in: accountIds } })
      .populate('accountId', 'accountNumber accountType')
      .sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, transactions });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Change PIN
exports.changePin = async (req, res) => {
  try {
    const { accountId, currentPin, newPin } = req.body;
    const account = await Account.findOne({ _id: accountId, userId: req.user._id, isActive: true });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    const isValid = await bcrypt.compare(String(currentPin), account.pin);
    if (!isValid) return res.status(400).json({ message: 'Current PIN is incorrect' });

    account.pin = await bcrypt.hash(String(newPin), 10);
    await account.save();
    res.json({ success: true, message: 'PIN changed successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Profile
exports.getProfile = async (req, res) => {
  res.json({ success: true, user: req.user });
};
