import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import ENV from 'dotenv';

ENV.config();

const user = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  salt: String,
  hash: String,
});

const secret = process.env.SECRET;

user.methods.setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

user.methods.validatePassword = (password) => {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return hash === this.hash;
};

user.methods.generateJWT = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return jwt.sign({
    id: this.id,
    email: this.email,
    name: this.username,
    expiry: parseInt(expiry.getDate(), 10),
  }, secret);
};

mongoose.model('User', user);
