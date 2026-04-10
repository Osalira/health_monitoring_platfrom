/**
 * Structured logger for production observability.
 *
 * Outputs JSON-formatted log lines that Vercel/hosting can parse.
 * Keeps context (route, action) attached to every log entry.
 */

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  context: string;
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

function log(level: LogLevel, context: string, message: string, meta?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    context,
    message,
    timestamp: new Date().toISOString(),
  };
  if (meta) entry.meta = meta;

  const line = JSON.stringify(entry);

  switch (level) {
    case 'error':
      console.error(line);
      break;
    case 'warn':
      console.warn(line);
      break;
    default:
      console.log(line);
  }
}

export const logger = {
  info: (context: string, message: string, meta?: Record<string, unknown>) =>
    log('info', context, message, meta),
  warn: (context: string, message: string, meta?: Record<string, unknown>) =>
    log('warn', context, message, meta),
  error: (context: string, message: string, meta?: Record<string, unknown>) =>
    log('error', context, message, meta),
};
