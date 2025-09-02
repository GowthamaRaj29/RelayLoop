import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module'; // Back to full module

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS for frontend communication
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite development server
      'http://localhost:3000', // Alternative development port
      process.env.FRONTEND_URL || 'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('RelayLoop Hospital Management System API')
    .setDescription('Backend API for RelayLoop - Hospital Management System with role-based access for Nurses, Doctors, and Administrators')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization')
    .addTag('Patients', 'Patient management operations')
    .addTag('Vital Signs', 'Patient vital signs recording and retrieval')
    .addTag('Users', 'User management for admins')
    .addTag('Departments', 'Hospital department management')
    .addTag('Reports', 'Analytics and reporting for admins')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  logger.log(`🚀 RelayLoop Backend is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🔗 Health Check: http://localhost:${port}/api/v1/health`);
}

bootstrap().catch(err => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
