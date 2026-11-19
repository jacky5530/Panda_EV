import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const doc = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Panda EV — intern practice API').build(),
  );
  SwaggerModule.setup('docs', app, doc); // http://localhost:3000/docs
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
