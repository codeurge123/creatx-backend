// Hamri Error karke classes hoti hai in nodejs to usii class ka reference le kar hum ye 'ApiError' class bana raha hai
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // bascially, remember -->  jab bhe hum overwrite karta hai to ek too super call hum karta he hai
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
