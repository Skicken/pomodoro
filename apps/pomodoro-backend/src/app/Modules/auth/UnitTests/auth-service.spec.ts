import { mockUser } from './helper';
import { Test } from '@nestjs/testing';
import { AuthenticateService, TokenPayload } from '../Services/authenticate.service';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { config } from 'dotenv';
import { UnauthorizedException } from '@nestjs/common';
import { ReturnUserDTO } from '../../pomodoro/Dto/user/user-dto';

/**
 * @group unit/backend
 */
describe('AuthenticationService', () => {
  let service: AuthenticateService;
  let prisma: DeepMockProxy<{
    [K in keyof PrismaClient]: Omit<PrismaClient[K], "groupBy">;
  }>;
  let jwtService:JwtService;
  beforeEach(async () => {
    config({path:"apps/pomodoro-backend/.env"});

    const module = await Test.createTestingModule({
      imports:[       JwtModule.register({
        global: true,
        secret: process.env.ACCESS_SECRET,
        signOptions: { expiresIn: '3600s' },
      })],
      providers: [PrismaService,AuthenticateService],

    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(AuthenticateService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService)
  });

  describe('Login', () => {

    it('user with valid credentials', async () => {
      const email = "test@wp.pl";
      const password = "1234";

      await prisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const user:ReturnUserDTO = await service.validateUser({login:email,password:password});
      expect(user).toBeDefined();
      expect(user.password).toBeUndefined()
      expect(user.nickname).toBe("test");

    });
    it('user with invalid credentials', async () => {

      const email = "test@wp.pl";
      const password = "123456";

      await prisma.user.findUnique.mockResolvedValueOnce(mockUser);

      const user:ReturnUserDTO = await service.validateUser({login:email,password:password});
      expect(user).toBeNull();
    });
    it('give user access and refresh token', async () => {

      const data = await service.GenerateAuthenticated(mockUser);

      expect(data.access_token).toBeDefined();
      expect(data.refresh_token).toBeDefined();
      expect(data.password).toBeUndefined();
      expect(data.nickname).toBe("test");

    });
    it('refresh access token with valid refresh token', async () => {

      const payload:TokenPayload = { sub: mockUser.id, role: mockUser.userType};

      const refresh_token = jwtService.sign(payload,{
        secret:process.env.REFRESH_SECRET,
        expiresIn:"7d"
      })

      await prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      const data =  await service.refreshToken(refresh_token);

      expect(data.access_token).toBeDefined();
      expect(data.password).toBeUndefined();
      expect(data.nickname).toBe("test");

    });

    it('refresh access token with invalid refresh token', async () => {

      const refresh_token = "some invalid token";
      await prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      await expect(service.refreshToken(refresh_token)).rejects.toThrow(
        UnauthorizedException
      );;

    });

  });

});
