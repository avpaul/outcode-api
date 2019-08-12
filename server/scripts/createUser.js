import mongoose from 'mongoose';
import yargs from 'yargs';
import '../models/db';

const User = mongoose.model('User');

const { argv } = yargs
  .command(
    ['create <firstName> <lastName> <email> <password>', '$0'],
    'create a new user',
    () => {
      yargs
        .positional('email', { description: 'email of the new user', type: 'string' })
        .positional('password', { type: 'string', description: 'password of the new user' })
        .positional('firstName', { type: 'string', description: 'new user first name' })
        .positional('lastName', { type: 'string', description: 'new user last name' });
    },
    (argv) => {
      const {
        email, password, firstName, lastName
      } = argv;
      const user = new User({
        email,
        firstName,
        lastName,
        salt: password,
        hash: password
      });
      user.setPassword(password);
      user
        .save()
        .then((data) => {
          // eslint-disable-next-line
          console.log(data);
          process.exit(0);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          process.exit(1);
        });
    }
  )
  .command(
    'delete <email>',
    'delete user',
    () => {
      yargs.positional('email', { description: 'email of the user to delete', type: 'string' });
    },
    (argv) => {
      const { email } = argv;
      User.findOneAndDelete({ email })
        .then((data) => {
          if (!data) {
            // eslint-disable-next-line
            console.log(`User with email: ${email} not found`);
            process.exit(1);
          }
          // eslint-disable-next-line
          console.log(`User with email: ${email} successfully deleted`);
          process.exit(0);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          process.exit(1);
        });
    }
  )
  .command(
    'change <email> <password>',
    'change user password',
    () => {
      yargs
        .positional('email', { description: 'email of the user', type: 'string' })
        .positional('password', { description: 'new password', type: 'string' });
    },
    (argv) => {
      const { email, password } = argv;

      User.findOne({ email }, (error, user) => {
        if (error) {
          // eslint-disable-next-line
          console.log(`Failed to update password \n ${error}`);
          process.exit(1);
        }
        if (!user) {
          // eslint-disable-next-line
          console.log(`User with email: ${email} not found`);
          process.exit(1);
        }
        user.setPassword(password);
        return user
          .save()
          .then(() => {
            // eslint-disable-next-line
            console.log(`Password successfully updated`);
            process.exit(0);
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.log(`Failed to update password \n ${error}`);
            process.exit(1);
          });
      });
    }
  );
