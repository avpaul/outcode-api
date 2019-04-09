import mongoose from 'mongoose';
import passport from 'passport';
import Boom from 'boom';

const User = mongoose.model('User');

export default {
  get: (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.render('./admin/login', { title: 'Login' });
  },

  create: (req, res, next) => {
    const { email } = req.body;
    const { password } = req.body;
    if (!email || !password) {
      if (!email && !password) {
        next(Boom.badRequest('email and password not found'));
      } else if (!email) {
        next(Boom.badRequest('email not found'));
      } else {
        next(Boom.badRequest('password not found'));
      }
    }

    const done = (token, id) => {
      res.status(200);
      res.json({
        token,
        id,
      });
    };

    const user = new User();
    user.email = email;
    user.setPassword(password);
    await user.save((err) => {
      if (err) {
        if (err.code === 11000) {
              next(Boom.badRequest(`User with email ${email} already exists`));
        } else {
          next(Boom.boomify(err));
        }
      } else {
        const token = user.generateJWT();
        done(token, user.id);
      }
    });
  },

  auth: (req, res, next) => {
    const { email } = req.body;
    const { password } = req.body;
    if (!email || !password) {
      if (!email && !password) {
        next(Boom.badRequest('email and password not found'));
      } else if (!email) {
        next(Boom.badRequest('email not found'));
      } else {
        next(Boom.badRequest('password not found'));
      }
    }
    const done = (token, id) => {
      res.setHeader('Set-Cookie', `id_token=${token};path=/;expires=${new Date(Date.now() + 60480000).toUTCString()};sameSite=true`);
      res.status(200);
      res.json({
        id,
        token,
      });
    };
    User.loginUser({
      email,
      password,
    }, done, req, res, next);
  },
};
