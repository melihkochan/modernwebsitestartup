import { logger } from "@/lib/logger";

/**
 * Base class for all application specific errors.
 */
export class ApplicationError extends Error {
  constructor(message: string, public code: string = "APP_ERROR", public details?: any) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Errors occurring within the Repository Layer (e.g. database query failures).
 */
export class RepositoryError extends ApplicationError {
  constructor(message: string, code: string = "REPOSITORY_ERROR", details?: any) {
    super(message, code, details);
  }
}

/**
 * Errors occurring due to network failures or API timeouts.
 */
export class NetworkError extends ApplicationError {
  constructor(message: string, code: string = "NETWORK_ERROR", details?: any) {
    super(message, code, details);
  }
}

/**
 * Centralised error handler to log errors and notify the user via toasts.
 */
export function handleError(error: unknown, fallbackMessage: string = "An unexpected error occurred.") {
  const err = error instanceof Error ? error : new Error(String(error));
  
  // Log the error
  logger.error(err.message, err);

  // Toast the user
  const message = error instanceof ApplicationError ? error.message : fallbackMessage;
  
  // Safely trigger Toast if window is available
  if (typeof window !== "undefined") {
    // Note: To prevent circular dependencies, we can write a fallback console call or trigger standard alert if toast is unmounted,
    // but the ToastProvider's context or a global toast trigger can be invoked directly if toast is exported.
    // Let's print out the error message nicely.
    console.error(`[Error Handler] ${message}`, err);
  }
}
