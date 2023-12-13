import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';
import { Field } from './types/field.type';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  set(key: string, value: object | string, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  get<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }

  async deleteField(key: string, field: Field) {
    const keyFromCache = (await this.get(key)) as DynamicObjectI;
    if (!keyFromCache)
      throw new HttpException(
        'Field ' + field + ' Does not exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    delete keyFromCache[field];
    return this.set(key, keyFromCache);
  }

  // TODO: Task: create get field function
}
