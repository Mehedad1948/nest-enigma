import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptor/data-response/data-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { config } from 'aws-sdk';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  // Swagger Config
  const swagertConfig = new DocumentBuilder()
    .setTitle('Nestjs Into Project')
    .setDescription('Use this base api url http://localhost:3000')
    .setTermsOfService('http://localhost:3000')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swagertConfig);
  SwaggerModule.setup('api', app, document);

  // Setup aws sdk

  const configService = app.get(ConfigService);
  config.update({
    credentials: {
      accessKeyId: configService.get('appConfig.awsAccessKey'),
      secretAccessKey: configService.get('appConfig.awsSecretKey'),
    },
    region: configService.get('appConfig.awsRegion'),
  });

  app.enableCors();
  // app.useGlobalInterceptors(new DataResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
