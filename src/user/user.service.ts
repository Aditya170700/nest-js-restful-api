import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import {v4 as uuid} from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`[UserService.register] ${JSON.stringify(request)}`);
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

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`[UserService.login] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(UserValidation.LOGIN, request);

    let user = (await this.prismaService.user.findUnique({
      where: {
        username: data.username
      }
    })) as User;

    if (!user) throw new HttpException('Username or password is wrong', HttpStatus.UNAUTHORIZED);
    if (!(await bcrypt.compare(data.password, user.password))) throw new HttpException('Username or password is wrong', HttpStatus.UNAUTHORIZED);

    user.token = uuid();

    await this.prismaService.user.update({
      where: {
        username: user.username
      },
      data: {
        token: user.token
      }
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token
    }
  }
}