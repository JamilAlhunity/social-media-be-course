import { ProfileStatus } from 'modules/users/enums/profile-status.enum';
import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';
import { ageToRestrict } from 'shared/util/date.util';
import { checkNullability } from 'shared/util/nullability.util';
import { Not, IsNull, LessThan, MoreThan, ILike, Equal, In } from 'typeorm';

export const filterPosts = (
  authorID: string,
  isAgeRestricted?: boolean,
  username?: string,
) => {
  const filterObject: DynamicObjectI = { author: {} };
  if (isAgeRestricted !== undefined) {
    filterObject['author']['birthday'] = isAgeRestricted
      ? MoreThan(ageToRestrict())
      : LessThan(ageToRestrict());
  }

  !checkNullability(username)
    ? (filterObject['author']['username'] = Not(IsNull()))
    : (filterObject['author']['username'] = ILike(`%${username}%`)); // TODO: Accurate results by separating by %
  filterObject['author']['profileStatus'] = Equal(ProfileStatus.PUBLIC);

  filterObject['author']['id'] = Not(authorID);

  return filterObject;
};

export const filterFeedPosts = (
  followings: string[],
  isAgeRestricted?: boolean,
  username?: string,
) => {
  const filterObject: DynamicObjectI = { author: {} };
  if (isAgeRestricted !== undefined) {
    filterObject['author']['birthday'] = isAgeRestricted
      ? MoreThan(ageToRestrict())
      : LessThan(ageToRestrict());
  }

  !checkNullability(username)
    ? (filterObject['author']['username'] = Not(IsNull()))
    : (filterObject['author']['username'] = ILike(`%${username}%`)); // TODO: Accurate results by separating by %
  filterObject['author']['profileStatus'] = Equal(ProfileStatus.PUBLIC);

  filterObject['author']['id'] = In(followings);

  return filterObject;
};
