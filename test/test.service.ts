import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Address, Contact, User } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteContact() {
    await this.prismaService.contact.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deleteAddress() {
    await this.prismaService.address.deleteMany({
      where: {
        contact: {
          username: 'test',
        },
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async createContact() {
    await this.prismaService.contact.create({
      data: {
        first_name: 'test',
        last_name: 'test',
        email: 'test@test.com',
        phone: '0000000000',
        username: 'test',
      },
    });
  }

  async createAddress() {
    const contact = await this.getContact();
    await this.prismaService.address.create({
      data: {
        contact_id: contact.id,
        street: 'test',
        city: 'test',
        province: 'test',
        country: 'test',
        postal_code: '12345',
      },
    });
  }

  async getUser(): Promise<User> {
    return (await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    })) as User;
  }

  async getContact(): Promise<Contact> {
    return (await this.prismaService.contact.findFirst({
      where: {
        username: 'test',
      },
    })) as Contact;
  }

  async getAddress(): Promise<Address> {
    return (await this.prismaService.address.findFirst({
      where: {
        contact: {
          username: 'test',
        },
      },
    })) as Address;
  }
}
