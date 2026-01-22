/**
 * Custom error classes for Node.js scripts
 * Following error-handling.mdc patterns
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  public readonly code: string

  public readonly statusCode: number

  public readonly isOperational: boolean

  constructor(message: string, code: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    this.isOperational = isOperational

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

/**
 * Validation error for invalid input
 */
export class ValidationError extends AppError {
  public readonly details?: Record<string, string>

  constructor(message: string, details?: Record<string, string>) {
    super(message, 'VALIDATION_ERROR', 400)
    this.details = details
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404)
  }
}

/**
 * Unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401)
  }
}

/**
 * Forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 'FORBIDDEN', 403)
  }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409)
  }
}

/**
 * Database error
 */
export class DatabaseError extends AppError {
  public readonly originalError?: Error

  constructor(message: string, originalError?: Error) {
    super(message, 'DATABASE_ERROR', 500, false)
    this.originalError = originalError
  }
}

/**
 * External service error (API calls, etc.)
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message: string) {
    super(`${service}: ${message}`, 'EXTERNAL_SERVICE_ERROR', 502)
  }
}
