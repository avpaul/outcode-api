import mongoose from 'mongoose';
import ENV from 'dotenv';
import './articles';
import './users';

ENV.config();

const { DATABASE_URL } = process.env;

mongoose.connect(DATABASE_URL, { useNewUrlParser: true });

mongoose.connection.on('connected', () => console.log(`Mongoose connected to ${DATABASE_URL}`));
mongoose.connection.on('error', err => console.log(`Mongoose connection error: ${err}`));
mongoose.connection.on('disconnected', () => console.log(`Mongoose disconnected from ${DATABASE_URL}`));

// reusable db connection close function
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(msg);
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
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});
