import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * 
 * whitelist: true: This setting removes any properties from the request body that are not explicitly defined in 
 * the DTO (Data Transfer Object). Only the properties that are part of the DTO will be kept,
 * effectively "whitelisting" the allowed fields.

forbidNonWhitelisted: true: When set to true, this option throws an error if any properties are present in the request body that
aren't defined in the DTO. This is helpful for strict data validation, ensuring that no unexpected properties are accepted.

transform: true: This enables automatic transformation of input data to match the types defined in your DTOs. 
For example, if your DTO defines a field as a number, the pipe will try to convert the input value to a number.

transformOptions: { enableImplicitConversion: true }: This option allows implicit type conversion in cases where
type annotations exist in the DTO, even without the @Type decorator from class-transformer. 
For example, a string "123" would automatically be converted to a number 123 if the DTO has the field defined as number.
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
