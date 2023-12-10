import { IsEmail, IsString } from 'class-validator';
import {
  MaxLength,
  MinLength,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsISO8601,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'resources/generated/i18n.generated';
import { Gender } from 'shared/enums/gender.enum';

export class CreateUserDto {
  id!: number;

  @IsString()
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.isNotEmpty'),
  })
  username!: string;

  @MaxLength(320)
  @MinLength(5)
  @IsEmail(undefined, {
    message: i18nValidationMessage<I18nTranslations>('validation.email'),
  })
  @IsString()
  @IsNotEmpty()
  email!: string;

  @MaxLength(30)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsEnum(Gender)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Gender must be a number' },
  )
  @IsNotEmpty()
  gender!: Gender;

  @IsISO8601()
  @IsNotEmpty()
  birthday!: string;

  @MaxLength(20)
  @MinLength(3)
  @IsNotEmpty()
  @IsOptional()
  city?: string;
}
