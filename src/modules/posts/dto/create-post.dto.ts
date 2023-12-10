import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class CreatePostDto {
  id!: number;
  @MaxLength(2200)
  @IsNotEmpty()
  text!: string;

  @IsUrl(undefined, {
    message: 'Image must be a valid URL',
  })
  @IsNotEmpty()
  image!: File; // url
}
