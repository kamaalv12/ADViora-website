import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Ensure no sensitive headers or raw payloads are automatically dumped
  redact: {
    paths: ['email', 'phone', 'message', 'req.headers.cookie', 'req.headers.authorization'],
    remove: true,
  },
});
