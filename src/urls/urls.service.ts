import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Url } from './url.entity';
import { UrlResponseDto } from './dto/url-response.dto';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
  ) {}

  async findAll(): Promise<UrlResponseDto[]> {
    const urls = await this.urlRepository.find();
    return urls.map((url) => ({
      id: url.id,
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    }));
  } 

  async findOne(id: number): Promise<UrlResponseDto | null> {
    const url = await this.urlRepository.findOne({ where: { id } });
    if (!url) {
      return null;
    }
    return {
      id: url.id,
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  async findByShortUrl(shortUrl: string): Promise<UrlResponseDto | null> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return {
      id: url.id,
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
    };
  }

  async create(url: Url): Promise<UrlResponseDto> {
    const newUrl = await this.urlRepository.save(url);
    return {
      id: newUrl.id,
      shortUrl: newUrl.shortUrl,
      originalUrl: newUrl.originalUrl,
      createdAt: newUrl.createdAt,
      updatedAt: newUrl.updatedAt,
    };
  }

  async update(id: number, url: Url): Promise<UrlResponseDto | null> {
    await this.urlRepository.update(id, url);
    const updatedUrl = await this.findOne(id);
    if (!updatedUrl) {
      return null;
    }
    return {
      id: updatedUrl.id,
      shortUrl: updatedUrl.shortUrl,
      originalUrl: updatedUrl.originalUrl,
      createdAt: updatedUrl.createdAt,
      updatedAt: updatedUrl.updatedAt,
    };
  }

  async delete(id: number): Promise<UrlResponseDto | null> {
    const urlToDelete = await this.findOne(id);
    if (!urlToDelete) {
        return null;
    }
    await this.urlRepository.delete(id);
    return {
      id: urlToDelete.id,
      shortUrl: urlToDelete.shortUrl,
      originalUrl: urlToDelete.originalUrl,
      createdAt: urlToDelete.createdAt,
      updatedAt: urlToDelete.updatedAt,
    };
  }

  async shortenUrl(url: string): Promise<UrlResponseDto> {
    const shortCode = randomBytes(4).toString('hex');
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    
    const newUrl = this.urlRepository.create({
      originalUrl: url,
      shortUrl,
    });
    
    const savedUrl = await this.urlRepository.save(newUrl);
    
    return {
      id: savedUrl.id,
      shortUrl: savedUrl.shortUrl,
      originalUrl: savedUrl.originalUrl,
      createdAt: savedUrl.createdAt,
      updatedAt: savedUrl.updatedAt,
    };
  }
}
