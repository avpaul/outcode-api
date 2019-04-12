import mongoose from 'mongoose';
import ENV from 'dotenv';
import '../models/post';
import '../models/users';

ENV.config();

const databaseURL = process.env.DATABASE_URL;

mongoose.connect(databaseURL, { useNewUrlParser: true });

mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', err => console.log(`Mongoose connection error: ${err}`));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// reusable db connection close function
const gracefulShutdown = (message, callback) => {
  mongoose.connection.close(() => {
    console.log(message);
    callback();
  });
};

// For nodemon restarts
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// For Heroku app termination
process.on('SIGTERM', () => {
  gracefulShutdown('heroku app shutdown', () => {
    process.exit(0);
  });
});
