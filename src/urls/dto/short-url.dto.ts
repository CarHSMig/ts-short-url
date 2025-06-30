import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class ShortUrlDto {
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(300)
  url: string;
}