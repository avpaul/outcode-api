const mongoose = require('mongoose');
const crypto = require('crypto');

const user = new mongoose.Schema({
  firstName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  salt: String,
  hash: String
});

user.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

user.methods.validatePassword = (password) => {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return hash === this.hash;
};

export default mongoose.model('User', user);
