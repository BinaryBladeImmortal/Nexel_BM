import { StatusCodes } from 'http-status-codes';

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, please try again later',
  };

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
  }

  // Handle duplicate key error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    defaultError.statusCode = StatusCodes.UNAUTHORIZED;
    defaultError.message = 'Invalid token';
  }

  // Handle JWT expired error
  if (err.name === 'TokenExpiredError') {
    defaultError.statusCode = StatusCodes.UNAUTHORIZED;
    defaultError.message = 'Token expired';
  }

  // Handle file upload errors
  if (err.name === 'MulterError') {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.message = err.message;
  }

  res.status(defaultError.statusCode).json({
    success: false,
    message: defaultError.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;
