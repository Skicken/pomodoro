import { createApp } from './test-helper';
import request from 'supertest';

import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PomodoroModule } from '../Modules/pomodoro/pomodoro.module';
import { config } from 'dotenv';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '@prisma/client';
import { TokenPayload } from '../Modules/auth/Services/authenticate.service';
import { AddSessionDTO } from '../Modules/pomodoro/Dto/add-session-dto';
import { SessionFilter } from '../Modules/pomodoro/Filters/SessionFilter';

/**
 * @group int
 */

describe('User Controller', () => {
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
  describe('/POST session', () => {
    it(`valid data`, () => {
      const session: AddSessionDTO = {
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
        state: 'SESSION',
        templateID: 1,
        userID: 1,
      };
      return request(app.getHttpServer())
        .post(`/session`)
        .send(session)
        .auth(user_token, { type: 'bearer' })
        .expect(201);
    });
    it(`invalid data`, () => {
      const session = {
        startDate: 'new Date(Date.now())',
        endDate: new Date(Date.now()),
        state: 'SESSION',
        templateID: '1',
        userID: 1,
      };
      return request(app.getHttpServer())
        .post(`/session`)
        .send(session)
        .auth(user_token, { type: 'bearer' })
        .expect(400);
    });
    it(`unauthorized`, () => {
      const session = {
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
        state: 'SESSION',
        templateID: 1,
        userID: 1,
      };
      return request(app.getHttpServer())
        .post(`/session`)
        .send(session)
        .expect(401);
    });
    it(`not owning template`, () => {
      const session: AddSessionDTO  = {
        startDate: new Date(Date.now()),
        endDate: new Date(Date.now()),
        state: 'SESSION',
        templateID: 3,
        userID: 1,
      };
      return request(app.getHttpServer())
        .post(`/session`)
        .send(session)
        .expect(401);
    });
  });
  describe('/GET session', () => {
    it('valid query', () => {
      const filter:SessionFilter = {
        userID: 1,
      }
      return request(app.getHttpServer())
        .get(`/session`)
        .send(filter)
        .auth(user_token, { type: 'bearer' })
        .expect(200);

    });
    it('unauthorized', () => {
      return request(app.getHttpServer())
        .get(`/session`)
        .expect(401);
    });
    it('not owning template', () => {
      const filter:SessionFilter = {
        userID: 1,
        templateID:4
      }
      return request(app.getHttpServer())
        .get(`/session`)
        .send(filter)
        .auth(user_token, { type: 'bearer' })
        .expect(403);
    });


  });
  afterAll(async () => {
    await app.close();
  });
});
