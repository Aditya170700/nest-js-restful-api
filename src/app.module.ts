import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';
import { AddressModule } from './address/address.module';
import { AppController } from './app.controller';

@Module({
  imports: [CommonModule, UserModule, ContactModule, AddressModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
