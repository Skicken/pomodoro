import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthenticateService } from "../Services/authenticate.service";
import { RoleGuard } from "../Guards/role.guard";

describe('AuthenticationService', () => {


  let service: AuthenticateService;
  let prisma: DeepMockProxy<{
    [K in keyof PrismaClient]: Omit<PrismaClient[K], "groupBy">;
  }>;

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
      providers: [JwtService,PrismaService,AuthenticateService],
    })      .overrideProvider(PrismaService)
            .useValue(mockDeep<PrismaClient>())
            .compile();

  });

  it("",()=>{

  })
});
