import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

import Cors from './middleware/cors';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // cors: true,
  });

  app.enableCors({
    // credentials: true,
    origin: process.env.CLIENT_URL,
  //   origin: '*',
  //   origin: true,
  });
  app.use(Cors);
  // app.use(Cors);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Backend Node.js for a construction equipment rental website')
    .setDescription('documentation Rest')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();