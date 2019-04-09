import Boom from 'boom';

export default {
  catch404: (req, res, next) => {
    next(Boom.notFound('That one was not found!'));
  },

  unauthorized: (err, req, res, next) => {
    if (Boom.isBoom(err)) {
      res.status(err.output.statusCode).json({
        status: res.statusCode,
        errors: [err],
      });
    }
    next(err);
  },

  // error handler
  errorHandler: (err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
    if (Boom.isBoom(err)) {
      res.status(err.output.statusCode || 500)
        .render('error', { error: err.output.payload });
    } else if (err.status === 500) {
      console.log(err);
    } else {
      res.status(err.status || 500)
        .render('error', {
          error: {
            statusCode: err.status,
            message: err.message,
          },
        });
    }
  },
};
