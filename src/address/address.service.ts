import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest,
} from '../model/address.model';
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

    const address = await this.checkAddress(data.address_id, data.contact_id);

    return this.toAddressResponse(address);
  }

  async update(user: User, request: UpdateAddressRequest): Promise<AddressResponse> {
    this.logger.debug(`[AddressService.update] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(AddressValidation.UPDATE, request);
    await this.contactService.checkContact(request.contact_id, user.username);
    let address = await this.checkAddress(data.id, data.contact_id);

    address = (await this.prismaService.address.update({
      where: {
        id: address.id
      },
      data: data
    })) as Address;

    return this.toAddressResponse(address);
  }

  async remove(user: User, request: RemoveAddressRequest): Promise<AddressResponse> {
    this.logger.debug(`[AddressService.remove] ${JSON.stringify(request)}`);
    const data = this.validationService.validate(AddressValidation.REMOVE, request);
    await this.contactService.checkContact(request.contact_id, user.username);
    await this.checkAddress(data.address_id, data.contact_id);

    const address = (await this.prismaService.address.delete({
      where: {
        id: data.address_id,
        contact_id: data.contact_id
      }
    })) as Address;

    return this.toAddressResponse(address);
  }

  async list(user: User, contactId: number): Promise<AddressResponse[]> {
    this.logger.debug(`[AddressService.remove] ${user}`);
    await this.contactService.checkContact(contactId, user.username);

    const results = (await this.prismaService.address.findMany({
      where: {
        contact_id: contactId
      }
    })) as Address[];

    return results.map(address => this.toAddressResponse(address));
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

  private async checkAddress(addressId: number, contactId: number): Promise<Address> {
    const address = (await this.prismaService.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId,
      }
    }) as Address);

    if (!address) throw new HttpException('Address not found', HttpStatus.NOT_FOUND);

    return address;
  }
}
