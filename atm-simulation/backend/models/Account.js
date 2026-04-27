const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber:  { type: String, unique: true, required: true },
  accountType:    { type: String, enum: ['savings', 'current', 'salary'], default: 'savings' },
  balance:        { type: Number, default: 0, min: 0 },
  pin:            { type: String, required: true },   // hashed 4-digit PIN
  isActive:       { type: Boolean, default: true },
  dailyLimit:     { type: Number, default: 20000 },
  withdrawnToday: { type: Number, default: 0 },
  lastResetDate:  { type: Date, default: Date.now }
}, { timestamps: true });

// Reset daily withdrawal if new day
accountSchema.methods.resetDailyIfNeeded = function() {
  const today = new Date().toDateString();
  const lastReset = new Date(this.lastResetDate).toDateString();
  if (today !== lastReset) {
    this.withdrawnToday = 0;
    this.lastResetDate = new Date();
  }
};

module.exports = mongoose.model('Account', accountSchema);
