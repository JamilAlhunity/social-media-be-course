import { HttpException, HttpStatus } from '@nestjs/common';
import { DynamicObjectI } from './dynamic-object.interface';

export interface ResponseFromServiceI<
  T = string | number | DynamicObjectI | DynamicObjectI[] | string[] | number[],
> {
  message: string;
  data: T;
  httpStatus: HttpStatus;
}

export function isResponseFromService(responseFromService?: DynamicObjectI) {
  if (!responseFromService) {
    throw new HttpException(
      'Response from service is falsy',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  if (typeof responseFromService.message !== 'string') {
    throw new HttpException(
      'Response message must be a string',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  if (!responseFromService.data) {
    throw new HttpException(
      'Response data must be provided',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
  if (!(responseFromService.httpStatus in HttpStatus)) {
    throw new HttpException(
      'Response HttpStatus is incorrect',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
