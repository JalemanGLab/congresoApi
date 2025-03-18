import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración CORS totalmente abierta
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: '*',
    credentials: false,
    maxAge: 86400,
    preflightContinue: true
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();