import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
  
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('HTTP');
  
  app.useGlobalPipes(new ValidationPipe());
  
  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  });

  await app.listen(3000);
  console.log('🚀 Application is running on: http://localhost:3000');
}
bootstrap();
