import { Controller, Post, Get, Put, Delete, Param, Body, Redirect, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Url } from './url.entity';
import { ShortUrlDto } from './dto/short-url.dto';
import { UrlResponseDto } from './dto/url-response.dto';
import { UnshortUrlDto } from './dto/unshort-url.dto';

@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('/shorten')
  async shortenUrl(@Body() body: ShortUrlDto): Promise<UrlResponseDto> {
    const result = await this.urlsService.shortenUrl(body.url);
    return result;
  }

  @Get(':shortUrl')
  @Redirect()
  async redirectToOriginalUrl(@Param('shortUrl') shortUrl: string) {
      try {
          const url = await this.urlsService.findByShortUrl(shortUrl);
          if (!url) {
              throw new NotFoundException('URL not found');
          }
          return {
              url: url.originalUrl,
              statusCode: 302
          };
      } catch (error) {
          if (error instanceof NotFoundException) {
              throw error;
          }
          throw new InternalServerErrorException('Error redirecting URL');
      }
  }

  @Post('/unshorten')
  async unshortenUrl(@Body() body: UnshortUrlDto): Promise<{ originalUrl: string }> {
    try {
      const url = await this.urlsService.findByShortUrl(body.shortUrl);
      if (!url) {
        throw new NotFoundException('URL not found');
      }
      return { originalUrl: url.originalUrl };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error unshortening URL');
    }
  }

  @Get()
  async findAll(): Promise<UrlResponseDto[]> {
    const result = await this.urlsService.findAll();
    return result;
  }
}