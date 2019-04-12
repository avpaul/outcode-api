import mongoose from 'mongoose';
import Boom from 'boom';

const User = mongoose.model('User');

export default {
  create: async (req, res, next) => {
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

    const user = new User();
    user.email = email;
    user.setPassword(password);
    await user.save((err, createdUser) => {
      if (err) {
        if (err.code === 11000) {
          next(Boom.badRequest(`User with email ${email} already exists`));
        } else {
          next(Boom.boomify(err));
        }
      } else {
        const token = user.generateJWT();
        res.json({
          id: createdUser.id,
          token,
        });
      }
    });
  },

  auth: (req, res, next) => {
    const { password, email } = req.body;
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
