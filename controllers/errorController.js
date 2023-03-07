const AppError = require('../utils/apiError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err?.path}: ${err?.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err, res) => {
  const value = err.errmsg.match(/(['"'])(\\?.)*?\1/)[0];
  const message = `Duplicate fields value: ${value}, Please use another value `;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid inputdata. ${errors.join()}`;
  return new AppError(message, 400);
};

const handleJWTError = err => {
  return new AppError('Invalid token. Please log in again', 401);
};
const handleJWTExpiredToken = err => {
  return new AppError('your Token has expired', 401);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  console.log(err.isOperational, 'this is operational');
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    res.status(500).json({
      status: '500',
      message: err || 'something went wrong'
    });
  }
};
module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);
    console.log(error.code);
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredToken(error);
    sendErrorProd(error, res);
  }
  //   res.status(err.statusCode).json({
  //     status: err.status,
  //     message: err.message
  //   });
};
