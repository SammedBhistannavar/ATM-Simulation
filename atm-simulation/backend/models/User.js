const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true, minlength: 6 },
  role:        { type: String, enum: ['superadmin', 'admin', 'user'], default: 'user' },
  phone:       { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lastLogin:   { type: Date, default: null }
}, { timestamps: true });



userSchema.methods.comparePassword = async function(candidatePassword) {
  return candidatePassword === this.password;
};

userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
