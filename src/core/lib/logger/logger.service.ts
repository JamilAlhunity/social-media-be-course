import {
  Injectable,
  LoggerService as NestJSLoggerService,
  LogLevel,
} from '@nestjs/common';
import {
  dateColor,
  errorColor,
  logColor,
  warnColor,
} from 'shared/constants/logger-colors.constant';
import { LoggerColorI } from 'shared/interfaces/logger-color.interface';
import { formattedDateForConsole } from 'shared/util/date.util';

@Injectable()
export class LoggerService implements NestJSLoggerService {
  log(message: string, context: string) {
    console.log(this.formatLog(message + ' ✔', 'log', logColor, context));
  }

  error(message: string, context: string) {
    console.log(this.formatLog(message + ' ❗', 'error', errorColor, context));
  }

  warn(message: string, context: string) {
    console.log(this.formatLog(message + ' ❓', 'warn', warnColor, context));
  }

  formatLog(
    message: string,
    logLevel: LogLevel,
    loggerColor: LoggerColorI,
    context: string,
  ) {
    const { contextColor, messageColor } = loggerColor;
    const formattedMessage = `${messageColor}[SOCIAL MEDIA APP] ${messageColor}${
      process.pid
    } - ${dateColor}${formattedDateForConsole()}     ${messageColor}${logLevel.toUpperCase()} ${contextColor}[${context}] ${messageColor}${message}`;

    return formattedMessage;
  }
}
