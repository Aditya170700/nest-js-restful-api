import { PrismaClient, Prisma } from '@prisma/client';
import { Logger } from 'winston';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, string> implements OnModuleInit {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    super({
      log: [
        {
          emit: 'event',
          level: 'info'
        },
        {
          emit: 'event',
          level: 'warn'
        },
        {
          emit: 'event',
          level: 'error'
        },
        {
          emit: 'event',
          level: 'query'
        }
      ]
    });
  }

  onModuleInit(): any {
    this.$on('info', (e) => {
      this.logger.info(`[PRISMA] ${JSON.stringify(e)}`);
    });
    this.$on('warn', (e) => {
      this.logger.warn(`[PRISMA] ${JSON.stringify(e)}`);
    });
    this.$on('error', (e) => {
      this.logger.error(`[PRISMA] ${JSON.stringify(e)}`);
    });
    this.$on('query', (e) => {
      this.logger.info(`[PRISMA] ${JSON.stringify(e)}`);
    });
  }
}
