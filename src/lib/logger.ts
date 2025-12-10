/**
 * Logger utility for consistent logging across the application.
 * In development, logs are written to the console.
 * In production, logs are suppressed (except errors which should be sent to error tracking).
 */

type LogLevel = 'debug' | 'log' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

const isDev = process.env.NODE_ENV === 'development';

/**
 * Formats a log message with optional context
 */
function formatMessage(message: string, context?: LogContext): string {
  if (!context || Object.keys(context).length === 0) {
    return message;
  }
  return `${message} ${JSON.stringify(context)}`;
}

/**
 * Sends error to external error tracking service (e.g., Sentry)
 * This is a placeholder - implement based on your error tracking solution
 */
function sendToErrorTracking(error: unknown, context?: LogContext): void {
  // TODO: Implement error tracking integration (e.g., Sentry)
  // Example: Sentry.captureException(error, { extra: context });
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Error tracking would go here
  }
}

export const logger = {
  /**
   * Debug level - for detailed debugging information
   * Only shown in development
   */
  debug: (message: string, context?: LogContext): void => {
    if (isDev) {
      console.debug(`[DEBUG] ${formatMessage(message, context)}`);
    }
  },

  /**
   * Log level - for general logging
   * Only shown in development
   */
  log: (message: string, context?: LogContext): void => {
    if (isDev) {
      console.log(`[LOG] ${formatMessage(message, context)}`);
    }
  },

  /**
   * Info level - for informational messages
   * Only shown in development
   */
  info: (message: string, context?: LogContext): void => {
    if (isDev) {
      console.info(`[INFO] ${formatMessage(message, context)}`);
    }
  },

  /**
   * Warn level - for warning messages
   * Shown in both development and production
   */
  warn: (message: string, context?: LogContext): void => {
    if (isDev) {
      console.warn(`[WARN] ${formatMessage(message, context)}`);
    }
    // Optionally send warnings to error tracking in production
  },

  /**
   * Error level - for error messages
   * Shown in development, sent to error tracking in production
   */
  error: (message: string, error?: unknown, context?: LogContext): void => {
    const errorContext = {
      ...context,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
    };

    if (isDev) {
      console.error(`[ERROR] ${formatMessage(message, errorContext)}`);
      if (error) {
        console.error(error);
      }
    } else {
      // In production, send to error tracking
      sendToErrorTracking(error, errorContext);
    }
  },

  /**
   * Group logs together (development only)
   */
  group: (label: string): void => {
    if (isDev) {
      console.group(label);
    }
  },

  /**
   * End a log group (development only)
   */
  groupEnd: (): void => {
    if (isDev) {
      console.groupEnd();
    }
  },

  /**
   * Log timing information (development only)
   */
  time: (label: string): void => {
    if (isDev) {
      console.time(label);
    }
  },

  /**
   * End timing and log duration (development only)
   */
  timeEnd: (label: string): void => {
    if (isDev) {
      console.timeEnd(label);
    }
  },
};

export default logger;
