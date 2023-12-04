import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class CreateCommentDto {
  @MaxLength(2200)
  @IsNotEmpty()
  text!: string;

  @IsPositive()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsNotEmpty()
  author!: number;

  @IsPositive()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsOptional()
  replyToComment!: number;
}
