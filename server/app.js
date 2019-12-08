import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import './models/db';
import indexRoutes from './routes/index';

const app = express();

app.use(
  cors({
    credentials: true,
    origin: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Authorization'
    ]
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
