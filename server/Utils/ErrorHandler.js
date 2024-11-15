const errorHandler = (statusCode, ErrorMessage) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = ErrorMessage;
  return error;
};

module.exports = errorHandler;