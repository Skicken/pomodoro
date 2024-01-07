import request from 'supertest';

import { Test } from '@nestjs/testing';
import { INestApplication, CanActivate, Logger } from '@nestjs/common';
import { PomodoroModule } from '../Modules/pomodoro/pomodoro.module';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { Template, UserType } from '@prisma/client';
import { env } from 'process';
import { TokenPayload } from '../Modules/auth/Services/authenticate.service';
import { TemplateFilter } from '../Modules/pomodoro/Filters/TemplateFilter';
import { AddTemplateDTO } from '../Modules/pomodoro/Dto/add-template-dto';
import { createApp } from './test-helper';

describe('Template Controller', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let user_token: string;
  let admin_token: string;

  beforeAll(async () => {
    config({ path: 'apps/pomodoro-backend/.env' });
    const moduleRef = await Test.createTestingModule({
      imports: [PomodoroModule],
    }).compile();

    app = createApp(moduleRef);
    await app.init();

    jwtService = moduleRef.get(JwtService);
    user_token = jwtService.sign(<TokenPayload>{ sub: 1, role: UserType.USER });
    admin_token = jwtService.sign(<TokenPayload>{
      sub: 1,
      role: UserType.ADMIN,
    });
  });
  describe('/GET template', () => {
    it(`get user default template`, async () => {
      const filter: TemplateFilter = {  userID: 1 };
      const template: Template = (
        await request(app.getHttpServer())
          .get('/template/default')
          .query(filter)
          .set('Accept', 'application/json')
          .auth(user_token, { type: 'bearer' })
          .expect(200)
      ).body;

      expect(template.isDefault).toBe(true);
      expect(template.userID).toBe(filter.userID);
    });
    it(`without userID on query`, async () => {
      const filter: TemplateFilter = {  };
      return request(app.getHttpServer())
        .get('/template')
        .query(filter)
        .set('Accept', 'application/json')
        .auth(user_token, { type: 'bearer' })
        .expect(400);
    });

  });
  describe('/POST template', () => {
    it(`with valid data`, async () => {
      const data: AddTemplateDTO = {
        templateName: 'Simple Template',
      };
      const template: Template = (
        await request(app.getHttpServer())
          .post('/template')
          .send(data)
          .auth(user_token, { type: 'bearer' })
          .expect(201)
      ).body;

      expect(template.isDefault).toBe(false);
      expect(template.userID).toBe(1);
    });
    it(`with empty data`, async () => {
      return request(app.getHttpServer())
        .post('/template')
        .auth(user_token, { type: 'bearer' })
        .expect(400);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
