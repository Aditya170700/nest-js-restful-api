import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`[REGISTER] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(UserValidation.REGISTER, request);

    const isExists = (await this.prismaService.user.count({
      where: {
        username: data.username
      }
    })) > 0;

    if (isExists) throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    data.password = await bcrypt.hash(data.password, 10);

    const user = (await this.prismaService.user.create({
      data: data
    })) as User;

    return {
      username: user.username,
      name: user.name,
    };
  }
}