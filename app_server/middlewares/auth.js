import jwt from 'jsonwebtoken';
import ejwt from 'express-jwt/lib';
import ENV from 'dotenv';

ENV.config();

const secret = process.env.SECRET;

export default {
  generateToken: (payload) => {
    jwt.sign({
      ...payload,
      exp: (Date.now() / 1000) + (60 * 60 * 5),
    }, secret);
  },

  authorize: ejwt({
    secret,
    userProperty: 'payload',
    getToken: function fromHeaderOrCookie(req) {
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
      }
      if (req.query && req.query.token) {
        return req.query.token;
      }
      if (req.cookies && req.cookies.token) {
        return req.cookies.token;
      }
      return null;
    },
  }),
};
