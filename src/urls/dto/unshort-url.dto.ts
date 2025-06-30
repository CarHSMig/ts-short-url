import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';

export class UnshortUrlDto {
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(300)
  shortUrl: string;
}