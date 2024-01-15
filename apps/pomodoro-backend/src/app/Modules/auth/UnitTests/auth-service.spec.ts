import { Test } from '@nestjs/testing';
import { AuthenticateService, TokenPayload } from '../Services/authenticate.service';
import { PrismaClient, User } from '@prisma/client';
import { ReturnUserDTO } from '../../pomodoro/Dto/user-dto';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { passwordHash } from '../../common/common';
import { config } from 'dotenv';
import { UnauthorizedException } from '@nestjs/common';

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
    const loginUser:User = {
      id: 1,
      createdAt: new Date(Date.now()),
      userType: 'USER',
      nickname: 'test',
      email: 'test@wp.pl',
      password: passwordHash('1234'),
      spotifyToken: ''
    }

    it('user with valid credentials', async () => {
      const email = "test@wp.pl";
      const password = "1234";

      await prisma.user.findUnique.mockResolvedValueOnce(loginUser);

      const user:ReturnUserDTO = await service.validateUser({login:email,password:password});
      expect(user).toBeDefined();
      expect(user.password).toBeUndefined()
      expect(user.nickname).toBe("test");

    });
    it('user with invalid credentials', async () => {

      const email = "test@wp.pl";
      const password = "123456";

      await prisma.user.findUnique.mockResolvedValueOnce(loginUser);

      const user:ReturnUserDTO = await service.validateUser({login:email,password:password});
      expect(user).toBeNull();
    });
    it('give user access and refresh token', async () => {

      const data = await service.login(loginUser);

      expect(data.access_token).toBeDefined();
      expect(data.refresh_token).toBeDefined();
      expect(data.password).toBeUndefined();
      expect(data.nickname).toBe("test");

    });
    it('refresh access token with valid refresh token', async () => {

      const payload:TokenPayload = { sub: loginUser.id, role: loginUser.userType};

      const refresh_token = jwtService.sign(payload,{
        secret:process.env.REFRESH_SECRET,
        expiresIn:"7d"
      })

      await prisma.user.findUnique.mockResolvedValueOnce(loginUser);
      const data =  await service.refreshToken(refresh_token);

      expect(data.access_token).toBeDefined();
      expect(data.password).toBeUndefined();
      expect(data.nickname).toBe("test");

    });

    it('refresh access token with invalid refresh token', async () => {

      const refresh_token = "some invalid token";
      await prisma.user.findUnique.mockResolvedValueOnce(loginUser);
      await expect(service.refreshToken(refresh_token)).rejects.toThrow(
        UnauthorizedException
      );;

    });

  });

});
