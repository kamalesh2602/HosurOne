import config from '../config/env.js';

/**
 * Centralized Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  // Log error details for backend diagnostics
  if (statusCode >= 500) {
    console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err);
  } else {
    console.warn(`[Client/Service Warning] ${req.method} ${req.originalUrl}: ${message}`);
  }

  const response = {
    success: false,
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
    },
  };

  // Only expose stack traces in non-production environments
  if (!config.isProduction && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default errorHandler;

