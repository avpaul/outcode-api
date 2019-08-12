import mongoose from 'mongoose';
import crypto from 'crypto';

/**
 *
 * @param {*} password
 * @return {void}
 */
function setPassword(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
}

/**
 *
 * @param {*} password
 * @return {void}
 */
function validatePassword(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return hash === this.hash;
}

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true }
});

UserSchema.methods.setPassword = setPassword;

UserSchema.methods.validatePassword = validatePassword;

export default mongoose.model('User', UserSchema);
