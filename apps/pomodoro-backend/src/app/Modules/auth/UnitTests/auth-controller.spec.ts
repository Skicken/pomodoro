import { TokenPayload } from './../Services/authenticate.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { config } from 'dotenv';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticateService } from '../Services/authenticate.service';
import { mockUser } from './helper';
import { AuthenticationController } from '../Controllers/authentication.controller';
import { Response,Request} from 'express';
/**
 * @group unit/backend
 */
describe('AuthenticationService', () => {


  let service: Pick<jest.MockedObject<AuthenticateService>, 'refreshToken' | 'login' | 'validateUser'>;
  let controller:AuthenticationController;
  beforeEach(async () => {
    config({ path: 'apps/pomodoro-backend/.env' });

    const module = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: process.env.ACCESS_SECRET,
          signOptions: { expiresIn: '3600s' },
        }),
      ],
      controllers:
      [
        AuthenticationController,
      ],
      providers: [
        JwtService,
        PrismaService,

        {
          provide: AuthenticateService,
          useValue: {
            refreshToken: jest.fn(),
            login:jest.fn(),
            validateUser:jest.fn()
          },
        },
      ],
    })
      .compile();
    service = module.get(AuthenticateService)
    controller = module.get(AuthenticationController)
  });

  it('', () => {
    const response:Response = new Response();
    const value = controller.login({

    },response)

  });
});
