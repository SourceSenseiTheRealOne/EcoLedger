import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for the dashboard
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:8081', 
      'http://localhost:8082',
      'http://localhost:8083',
      'http://localhost:8084',
      'http://localhost:8085',
      'http://localhost:8086',
      'http://localhost:8087',
      'http://localhost:8088',
      'http://localhost:8089',
      'http://localhost:8090',
      /^http:\/\/localhost:\d+$/, // Allow any localhost port
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`EcoLedger Server running on port ${port}`);
}
bootstrap();
