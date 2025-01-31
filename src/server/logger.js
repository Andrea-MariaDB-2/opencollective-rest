import expressWinston from 'express-winston';
import winston from 'winston';

function getLogLevel() {
  if (process.env.LOG_LEVEL) {
    return process.env.LOG_LEVEL;
  } else if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'circleci'
  ) {
    return 'warn';
  } else {
    return 'info';
  }
}

const logger = winston.createLogger();

const winstonConsole = new winston.transports.Console({
  level: getLogLevel(),
  format: winston.format.combine(winston.format.colorize(), winston.format.splat(), winston.format.simple()),
});

logger.add(winstonConsole);
logger.exceptions.handle(winstonConsole);

const loggerMiddleware = {
  logger: expressWinston.logger({
    winstonInstance: logger,
    meta: false,
    colorize: true,
    msg: `{{req.ip}} {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms - {{req.headers['user-agent']}}`,
    ignoreRoute: (req) => req.url.match(/^\/_/),
  }),
  errorLogger: expressWinston.errorLogger({
    winstonInstance: logger,
  }),
};

export { logger, loggerMiddleware };
