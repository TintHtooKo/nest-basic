import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Swagger
  const config = new DocumentBuilder()
                    .setTitle("NestJS Basic")
                    .setDescription("This is NestJS Basic Description")
                    .setVersion("1.0").build();
  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("api-doc",app,document)

  app.enableCors()

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
