import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RequestsLoggerService } from 'core/lib/logger/requests-logger.service';
import { map, Observable } from 'rxjs';
import { RequestI } from 'shared/interfaces/request.interface';
import { requestMapper } from 'shared/util/request-mapper.util';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly requestsLoggerService: RequestsLoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestI>();
    const then = Date.now();

    return next.handle().pipe(
      map((value: any) => {
        const now = Date.now() - then;
        const loggedRequest = requestMapper(request);
        this.requestsLoggerService.logRequest(loggedRequest, {
          ...value,
          requestDuration: now,
        });

        return value;
      }),
    );
  }
}
