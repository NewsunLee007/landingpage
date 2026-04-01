const LOG_LEVEL = (process.env.LOG_LEVEL || 'info').toLowerCase() as 'debug' | 'info' | 'warn' | 'error';

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const colors = {
  debug: '\x1b[36m',
  info: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m'
};

function shouldLog(level: string): boolean {
  return levels[level as keyof typeof levels] >= levels[LOG_LEVEL];
}

function formatMessage(level: string, ...args: any[]): string {
  const timestamp = new Date().toISOString();
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
  ).join(' ');
  return `${colors[level as keyof typeof colors]}[${timestamp}] [${level.toUpperCase()}]${colors.reset} ${message}`;
}

export const logger = {
  debug(...args: any[]): void {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', ...args));
    }
  },
  
  info(...args: any[]): void {
    if (shouldLog('info')) {
      console.log(formatMessage('info', ...args));
    }
  },
  
  warn(...args: any[]): void {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', ...args));
    }
  },
  
  error(...args: any[]): void {
    if (shouldLog('error')) {
      console.error(formatMessage('error', ...args));
    }
  }
};
