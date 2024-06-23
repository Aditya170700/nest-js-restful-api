import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Contact, User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  SearchContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { ContactValidation } from './contact.validation';
import { ValidationService } from '../common/validation.service';
import { WebResponse } from '../model/web.model';

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
    this.logger.debug(`[ContactService.get] ${contactId}`);
    let result = await this.checkContact(contactId, user.username);

    return this.toContactResponse(result);
  }

  async update(user: User, request: UpdateContactRequest): Promise<ContactResponse> {
    this.logger.debug(`[ContactService.update] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(ContactValidation.UPDATE, request);
    let result = await this.checkContact(request.id, user.username);

    result = (await this.prismaService.contact.update({
      where: {
        id: result.id,
      },
      data: data
    }) as Contact);

    return this.toContactResponse(result);
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.debug(`[ContactService.remove] ${contactId}`);
    let result = await this.checkContact(contactId, user.username);

    result = (await this.prismaService.contact.delete({
      where: {
        id: result.id,
      }
    }) as Contact);

    return this.toContactResponse(result);
  }

  async search(user: User, request: SearchContactRequest): Promise<WebResponse<ContactResponse[]>> {
    this.logger.debug(`[ContactService.search] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(ContactValidation.SEARCH, request);

    const filters = [];

    if (data.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: data.name,
            }
          },
          {
            last_name: {
              contains: data.name,
            }
          }
        ]
      });
    }

    if (data.email) {
      filters.push({
        email: {
          contains: data.email,
        }
      });
    }

    if (data.phone) {
      filters.push({
        phone: {
          contains: data.phone,
        }
      });
    }

    const skip = (data.page - 1) * data.size;

    const results = await this.prismaService.contact.findMany({
      where: {
        username: user.username,
        AND: filters
      },
      take: data.size,
      skip: skip,
    });

    const total =  await this.prismaService.contact.count({
      where: {
        username: user.username,
        AND: filters
      }
    });

    return {
      data: results.map(contact => this.toContactResponse(contact)),
      paging: {
        current_page: data.page,
        size: data.size,
        total_page: Math.ceil(total / data.size),
      }
    }
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

  public async checkContact(contactId: number, username: string): Promise<Contact> {
    let result = (await this.prismaService.contact.findFirst({
      where: {
        id: contactId,
        username: username
      }
    }) as Contact);

    if (!result) throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    return result;
  }
}
