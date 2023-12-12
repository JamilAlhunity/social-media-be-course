import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from 'core/exception-filters/http-exception.filter';
import { AccessTokenGuard } from 'core/guards/access-token/access-token.guard';
import { LoggingInterceptor } from 'core/interceptors/logging.interceptor';

const accessTokenGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: AccessTokenGuard,
};
const httpExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};

const loggingInterceptor: Provider = {
  provide: APP_INTERCEPTOR,
  useClass: LoggingInterceptor,
};

export const filters = [httpExceptionFilterProvider];
export const guards = [accessTokenGuardProvider];
export const interceptors = [loggingInterceptor];
