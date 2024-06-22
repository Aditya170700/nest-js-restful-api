import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Contact, User } from '@prisma/client';
import { ContactResponse, CreateContactRequest } from '../model/contact.model';
import { ContactValidation } from './contact.validation';
import { ValidationService } from '../common/validation.service';

@Injectable()
export class ContactService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async create(user: User, request: CreateContactRequest): Promise<ContactResponse> {
    this.logger.debug(`[ContactService.create] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(ContactValidation.CREATE, request);

    const result = (await this.prismaService.contact.create({
      data: {
        ...data,
        ...{username:user.username}
      }
    })) as Contact;

    return this.toContactResponse(result);
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    const result = (await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        username: user.username
      }
    }) as Contact);

    if (!result) throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    return this.toContactResponse(result);
  }

  private toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone: contact.phone,
    }
  }
}
