import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';
import { FilterDto } from 'shared/dtos/filter.dto';

export class FilterPostsDto extends FilterDto {
  @ApiProperty({
    description:
      'Flag to indicate if the posts should be from users under 13 or not',
    example: true,
    isArray: false,
    name: 'isAgeRestricted',
    required: false,
    type: Boolean,
  })
  @IsBoolean()
  @Type(() => String)
  @Transform(({ value }) => {
    if (value === 'true') {
      return true;
    } else {
      return false;
    }
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  isAgeRestricted?: boolean;

  @ApiProperty({
    description: "User's username",
    example: 'mut1aq',
    isArray: false,
    maxLength: 30,
    name: 'username',
    required: false,
    type: String,
  })
  @MaxLength(30, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 30,
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  username?: string;
}
