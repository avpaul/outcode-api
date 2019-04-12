import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from 'passport';
import ENV from 'dotenv';
import BrowserSyncMiddleware from './app_server/middlewares/browsersync';
import ErrorHandlers from './app_server/middlewares/errorhandlers';
import WebpackMiddleware from './app_server/middlewares/webpack';
import './app_server/configs/database';
import './app_server/configs/passport';
import appRoutes from './app_server/routes/index';


ENV.config();

const app = express();
const port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// add all development middleware's
if (!(process.env.MODE === 'prod')) {
  // add browser-sync middleware
  app.use(BrowserSyncMiddleware);

  // add webpack dev server and hot module replacement middleware
  app.use(WebpackMiddleware.webpackDev);
  app.use(WebpackMiddleware.webpackHotReplacement);
}

// initialize passport for auth
app.use(passport.initialize({}));

// add app routing
app.use(appRoutes);

app.use(ErrorHandlers.catch404);
app.use(ErrorHandlers.errorHandler);

app.listen(port);

export default app;
