import cookieParser from 'cookie-parser';
import request from 'supertest';

import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthUserDTO } from '../Modules/auth/DTO/auth-user-dto';
import { AuthModule } from '../Modules/auth/auth.module';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../Modules/auth/Services/authenticate.service';
import { UserType } from '@prisma/client';
import { env } from 'process';

/**
 * @group int
 */
describe('Auth Controller', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  beforeAll(async () => {
    config({ path: 'apps/pomodoro-backend/.env' });

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule, AuthModule],
    }).compile();

    app = moduleRef.createNestApplication();
    jwtService = moduleRef.get(JwtService);
    app.use(cookieParser());
    await app.init();
  });
  beforeEach(() => {});
  it(`/POST auth valid login johnny`, () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'johnny@gmail.pl', password: 'johnny' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then((response) => {
        const user: AuthUserDTO = response.body;
        expect(user).toBeDefined();
        expect(user.access_token).toBeDefined();
        expect(user.email).toBe('johnny@gmail.pl');
        expect(user.password).toBeUndefined();
      });
  });
  it(`/POST auth invalid login johnny`, () => {
    return request(app.getHttpServer())
      .post('/auth/login')

      .send({ username: 'johnny@gmail.pl', password: 'johnny123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });
  it(`/POST refresh without refresh token`, () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });
  it(`/POST refresh with valid refresh token`, () => {
    const refreshToken = jwtService.sign(
      <TokenPayload>{ sub: 1, role: UserType.USER },
      {
        secret: env.REFRESH_TOKEN,
      }
    );
    request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [`refresh_token=${refreshToken}`])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });
  it(`/POST refresh with invalid refresh token`, () => {
    const refreshToken = jwtService.sign(
      <TokenPayload>{ sub: 1, role: UserType.USER },
      {
        secret: '123',
      }
    );
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [`refresh_token=${refreshToken}`])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
