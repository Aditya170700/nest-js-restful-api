import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { AddressResponse, CreateAddressRequest, GetAddressRequest } from '../model/address.model';
import { Address, User } from '@prisma/client';
import { ContactService } from '../contact/contact.service';
import { AddressValidation } from './address.validation';

@Injectable()
export class AddressService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private contactService: ContactService,
  ) {
  }

  async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
    this.logger.debug(`[AddressService.create] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(AddressValidation.CREATE, request);
    await this.contactService.checkContact(request.contact_id, user.username);

    const address = (await this.prismaService.address.create({
      data: data
    }) as Address);

    return this.toAddressResponse(address);
  }

  async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
    this.logger.debug(`[AddressService.get] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(AddressValidation.GET, request);
    await this.contactService.checkContact(request.contact_id, user.username);

    const address = (await this.prismaService.address.findFirst({
      where: {
        id: data.address_id,
        contact_id: data.contact_id,
      }
    }) as Address);

    if (!address) throw new HttpException('Address not found', HttpStatus.NOT_FOUND);

    return this.toAddressResponse(address);
  }

  private toAddressResponse(address: Address): AddressResponse {
    return {
      id: address.id,
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postal_code: address.postal_code,
    }
  }
}
