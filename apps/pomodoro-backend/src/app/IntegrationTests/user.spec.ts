import { createApp } from './test-helper';
import request from 'supertest';

import { Test } from '@nestjs/testing';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { PomodoroModule } from '../Modules/pomodoro/pomodoro.module';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '@prisma/client';
import { TokenPayload } from '../Modules/auth/Services/authenticate.service';
import { AddUserDTO } from '../Modules/pomodoro/Dto/add-user-dto';
import { UpdateUserDTO } from '../Modules/pomodoro/Dto/update-user-dto';
import { ReturnUserDTO } from '../Modules/pomodoro/Dto/user-dto';

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
  describe('/GET user', () => {
    it(`all without token`, () => {
      return request(app.getHttpServer()).get('/user').expect(401);
    });
    it(`all with invalid token`, () => {
      return request(app.getHttpServer())
        .get('/user')
        .auth('123', { type: 'bearer' })
        .expect(401);
    });
    it(`all with normal user token`, () => {
      return request(app.getHttpServer())
        .get('/user')
        .auth(user_token, { type: 'bearer' })
        .expect(403);
    });
    it(`/all with admin user token`, () => {
      return request(app.getHttpServer())
        .get('/user')
        .auth(admin_token, { type: 'bearer' })
        .expect(200);
    });
    it(`self data with normal user token`, () => {
      return request(app.getHttpServer())
        .get('/user/1')
        .auth(admin_token, { type: 'bearer' })
        .expect(200);
    });
  });

  describe('/POST user', () => {
    it(`with valid data`, async () => {
      const newUser: AddUserDTO = {
        nickname: 'Skicken',
        password: '12345',
        email: 'm@interia.pl',
      };
      const response:ReturnUserDTO = (
        await request(app.getHttpServer())
          .post('/user')
          .send(newUser)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(201)
      ).body;
      expect(response).toBeDefined();
      expect(response.password).toBeUndefined();
      expect(response.nickname).toBe(newUser.nickname);
      expect(response.email).toBe(newUser.email);
    });
    it(`with invalid email`, () => {
      const newUser: AddUserDTO = {
        nickname: 'Skicken',
        password: '12345',
        email: 'interia.pl',
      };
      return request(app.getHttpServer())
        .post('/user')
        .send(newUser)
        .set('Accept', 'application/json')
        .expect(400);
    });
    it(`with no data`, () => {
      return request(app.getHttpServer()).post('/user').expect(400);
    });
  });
  describe('/DELETE user', () => {
    it(`self with user token`, async () => {
      const id = 4;
      const token = jwtService.sign(<TokenPayload>{sub:id,role:UserType.USER});

      return request(app.getHttpServer())
        .delete(`/user/${id}`)
        .auth(token, { type: 'bearer' })
        .expect(204);
    });
    it(`other with user token`, async () => {
      const id = 3;
      return request(app.getHttpServer())
        .delete(`/user/${id}`)
        .auth(user_token, { type: 'bearer' })
        .expect(403);
    });

    it(`other with admin token`, async () => {
      const id = 3;
      return request(app.getHttpServer())
        .delete(`/user/${id}`)
        .auth(admin_token, { type: 'bearer' })
        .expect(204);
    });

    it(`non existing other with admin token`, async () => {
      const id = 4;
      return request(app.getHttpServer())
        .delete(`/user/${id}`)
        .auth(admin_token, { type: 'bearer' })
        .expect(204);
    });
  });

  describe('/PUT user', () => {
    it(`with valid data`, async () => {
      const update:UpdateUserDTO = {
        nickname: 'Skicken1',
        password: '1234567',
      };
      const id = 1;
      const response:ReturnUserDTO = ( await request(app.getHttpServer())
        .put(`/user/${id}`)
        .send(update)
        .auth(user_token, { type: 'bearer' })
        .expect(201)).body;
      expect(response.nickname).toBe(update.nickname);
      expect(response.password).toBeUndefined();
    });
    it(`empty body`, async () => {
      const update:UpdateUserDTO = {};
      const id = 1;
       await request(app.getHttpServer())
        .put(`/user/${id}`)
        .send(update)
        .auth(user_token, { type: 'bearer' })
        .expect(201);
    });

  });
  afterAll(async () => {
    await app.close();
  });
});
