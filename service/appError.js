const appError = (httpStatus, errMessage, next) => {
  console.log('app error');
  const error = new Error(errMessage);
  error.statusCode = httpStatus;
  error.isOperational = true;
  next(error);
};

module.exports = appError;
