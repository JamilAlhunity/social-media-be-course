import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';

export class CreatePostDto {
  @ApiProperty({
    description: "Post's images",
    example: 'https:',
    isArray: false,
    maxLength: 2048,
    minLength: 3,
    name: 'images',
    required: false,
    type: String,
  })
  @MaxLength(2048, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 2048,
    }),
    each: true,
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: 3,
    }),
    each: true,
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
    each: true,
  })
  @IsArray()
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
    each: true,
  })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: "Post's videos",
    example: 'https:',
    isArray: false,
    maxLength: 2048,
    minLength: 3,
    name: 'videos',
    required: false,
    type: String,
  })
  @MaxLength(2048, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 2048,
    }),
    each: true,
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      min: 3,
    }),
    each: true,
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
    each: true,
  })
  @IsArray()
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
    each: true,
  })
  @IsOptional()
  videos?: string[];

  @ApiProperty({
    description: "Post's text",
    example: 'some string',
    isArray: false,
    maxLength: 2200,
    name: 'text',
    required: false,
    type: String,
  })
  @MaxLength(2200, {
    message: i18nValidationMessage<I18nTranslations>('validation.minLength', {
      max: 2200,
    }),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.isString'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  @IsOptional()
  text?: string;
}
