const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  accountId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:         { type: String, enum: ['deposit', 'withdrawal', 'transfer', 'balance_inquiry'], required: true },
  amount:       { type: Number, default: 0 },
  balanceBefore:{ type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  toAccount:    { type: String, default: null },     // for transfers
  description:  { type: String, default: '' },
  status:       { type: String, enum: ['success', 'failed', 'pending'], default: 'success' },
  reference:    { type: String, unique: true }
}, { timestamps: true });

// Auto-generate reference number
transactionSchema.pre('save', function(next) {
  if (!this.reference) {
    this.reference = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
