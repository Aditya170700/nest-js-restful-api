import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const configService = app.get(ConfigService);

  app.useLogger(logger);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get('RMQ_URL')] as string[],
      queue: 'email',
      queueOptions: {
        durable: true,
        arguments: {
          'x-queue-type': 'quorum',
        }
      }
    }
  });
  await app.startAllMicroservices();
  await app.listen(4000);
}
bootstrap();
