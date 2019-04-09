import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';

const User = mongoose.model('User');

passport.use(new LocalStrategy.Strategy({
  usernameField: 'email',
},
((email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message: 'User not found',
      });
    }
    if (!user.validatePassword(password)) {
      return done(null, false, {
        message: 'Password is not correct',
      });
    }
    return done(null, user);
  });
})));
