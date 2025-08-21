import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for all origins and methods
  app.enableCors({
    origin: 'http://localhost:3001', // or '*' for all, more secure to specify
    credentials: true, // if using cookies/auth headers
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
