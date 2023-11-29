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
import { Gender } from 'src/shared/enums/gender.enum';

export class CreateUserDto {
  id: number;

  @IsString()
  @IsNotEmpty({ message: 'Username must be provided' })
  username: string;

  @MaxLength(320)
  @MinLength(5)
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MaxLength(30)
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Gender)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Gender must be a number' },
  )
  @IsNotEmpty()
  gender: Gender;

  @IsISO8601()
  @IsNotEmpty()
  birthday: string;

  @MaxLength(20)
  @MinLength(3)
  @IsNotEmpty()
  @IsOptional()
  city: string;
}
