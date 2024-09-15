// Function to handle success responses
export const sendSuccessResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      errors: null,
    });
  };
  
  // Function to handle error responses
  export const sendErrorResponse = (res, statusCode, message, errors = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors,
    });
  };