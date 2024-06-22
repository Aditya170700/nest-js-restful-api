import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { ContactResponse, CreateContactRequest, UpdateContactRequest } from '../model/contact.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Auth() user: User,
    @Body() request: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>>
  {
    const result = await this.contactService.create(user, request);
    return {
      data: result,
    }
  }

  @Get('/:contactId')
  @HttpCode(HttpStatus.OK)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>>
  {
    const result = await this.contactService.get(user, contactId);
    return {
      data: result,
    }
  }

  @Put('/:contactId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() request: UpdateContactRequest
  ): Promise<WebResponse<ContactResponse>>
  {
    request.id = contactId;
    const result = await this.contactService.update(user, request);
    return {
      data: result,
    }
  }
}
