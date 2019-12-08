import express from 'express';
import env from 'dotenv';
import logger from 'morgan';
import './models/db';
import indexRoutes from './routes/index';

env.config();
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.header(
    'Access-Control-Allow-Methods',
    'OPTIONS,GET,POST,PUT,UPDATE,DELETE'
  );
  res.header('Access-Control-Allow-Headers', [
    'Content-Type',
    'Accept',
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Authorization'
  ]);
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));
app.use(indexRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const notFoundError = new Error('resource not found');
  next(notFoundError);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    statusCode: err.status,
    message: err.message
  });
});

export default app;
