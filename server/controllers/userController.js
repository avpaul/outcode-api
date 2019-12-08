import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

const User = mongoose.model('User');

/**
 *
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @return {object} response
 */
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = new Error('email or password empty');
    error.status = 400;
    return next(error);
  }

  return User.findOne({ email }, null, {}, (error, user) => {
    if (error) return next(error);
    if (!user) {
      return res.status(400).json({ error: 'email or password incorrect' });
    }
    if (user.validatePassword(password)) {
      const { SECRET } = process.env;
      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        SECRET,
        {
          expiresIn: '90d',
          audience: 'author'
        }
      );
      res.cookie('token', token, {
        expires: new Date(Date.now() + 7776e6),
        domain: 'localhost',
        httpOnly: true,
        sameSite: 'strict'
      });
      // TODO: set cookie domain domain: '.outcode.dev'
      // secure: process.env.NODE_ENV === 'production',
      return res.status(200).json({ message: 'Login successful', token });
    }
    return res.status(400).json({ error: 'email or password incorrect' });
  });
};

export default login;
