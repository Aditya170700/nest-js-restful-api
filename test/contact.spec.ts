import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('ContactController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/contacts', () => {
    beforeEach(async () => {
      await testService.createUser();
    });

    afterEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('Should be rejected if request invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to create contact', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/contacts')
        .set('Authorization', 'test')
        .send({
          first_name: 'test',
          last_name: 'test',
          email: 'test@test.com',
          phone: '089626262626',
        });

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.CREATED);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.first_name).toBe('test');
      expect(response.body.data.last_name).toBe('test');
      expect(response.body.data.email).toBe('test@test.com');
      expect(response.body.data.phone).toBe('089626262626');
    });
  });

  describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
    });

    afterEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('Should be rejected if id not number', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/one`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be rejected if id not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to get contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .get(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test');

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(contact.id);
      expect(response.body.data.first_name).toBe(contact.first_name);
      expect(response.body.data.last_name).toBe(contact.last_name);
      expect(response.body.data.email).toBe(contact.email);
      expect(response.body.data.phone).toBe(contact.phone);
    });
  });

  describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
      await testService.createUser();
      await testService.createContact();
    });

    afterEach(async () => {
      await testService.deleteContact();
      await testService.deleteUser();
    });

    it('Should be rejected if id not number', async () => {
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/one`)
        .set('Authorization', 'test')
        .send({
          first_name: 'testedit',
          last_name: 'testedit',
          email: 'testedit@test.com',
          phone: '0000',
        });

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be rejected if id not found', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id + 1}`)
        .set('Authorization', 'test')
        .send({
          first_name: 'testedit',
          last_name: 'testedit',
          email: 'testedit@test.com',
          phone: '0000',
        });

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
    });

    it('Should be able to update contact', async () => {
      const contact = await testService.getContact();
      const response = await request(app.getHttpServer())
        .put(`/api/contacts/${contact.id}`)
        .set('Authorization', 'test')
        .send({
          first_name: 'testedit',
          last_name: 'testedit',
          email: 'testedit@test.com',
          phone: '0000',
        });

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(contact.id);
      expect(response.body.data.first_name).toBe('testedit');
      expect(response.body.data.last_name).toBe('testedit');
      expect(response.body.data.email).toBe('testedit@test.com');
      expect(response.body.data.phone).toBe('0000');
    });
  });
});
