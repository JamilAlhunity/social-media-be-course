import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from 'core/exception-filters/http-exception.filter';
import { AccessTokenGuard } from 'core/guards/access-token/access-token.guard';

const accessTokenGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: AccessTokenGuard,
};
const httpExceptionFilterProvider: Provider = {
  provide: APP_FILTER,
  useClass: HttpExceptionFilter,
};
export const filters = [httpExceptionFilterProvider];
export const guards = [accessTokenGuardProvider];
