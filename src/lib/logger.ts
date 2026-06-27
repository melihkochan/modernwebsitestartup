/**
 * Broadcaster application logger utility.
 *
 * Provides formatted output in development mode and restricts logging in production to prevent performance leaks.
 */
const isDev = process.env.NODE_ENV === "development";

export const logger = {
  info(message: string, ...meta: unknown[]) {
    if (isDev) {
      // eslint-disable-next-line no-console
      console.log(`%c[INFO] %c${message}`, "color: #3b82f6; font-weight: bold;", "color: inherit;", ...meta);
    }
  },

  warn(message: string, ...meta: unknown[]) {
    if (isDev) {
      console.warn(`%c[WARN] %c${message}`, "color: #f59e0b; font-weight: bold;", "color: inherit;", ...meta);
    }
  },

  error(message: string, ...meta: unknown[]) {
    // Error logs are printed in both dev and production for critical reporting
    console.error(`%c[ERROR] %c${message}`, "color: #ef4444; font-weight: bold;", "color: inherit;", ...meta);
  },
};
