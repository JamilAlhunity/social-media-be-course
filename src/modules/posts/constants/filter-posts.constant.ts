import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';
import { ageToRestrict } from 'shared/util/date.util';
import { checkNullability } from 'shared/util/nullability.util';
import { Not, IsNull, LessThan, MoreThan, ILike } from 'typeorm';

export const filterPosts = (isAgeRestricted?: boolean, username?: string) => {
  const filterObject: DynamicObjectI = { author: {} };
  if (isAgeRestricted !== undefined) {
    filterObject['author']['birthday'] = isAgeRestricted
      ? MoreThan(ageToRestrict())
      : LessThan(ageToRestrict());
  }

  !checkNullability(username)
    ? (filterObject['author']['username'] = Not(IsNull()))
    : (filterObject['author']['username'] = ILike(`%${username}%`)); // TODO: Accurate results by separating by %

  return filterObject;
};
